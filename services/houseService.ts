import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getHouses() {
  const userId = await getUserIdFromToken();
  
  const houses = await prisma.house.findMany({
    include: {
      images: true,
      region: true,
      owner: true,
      savedBy: userId ? {
        where: { userId },
        select: { savedId: true }
      } : false,
    },
  });

  return houses.map(house => ({
    ...house,
    isDefaultFavorite: house.savedBy && house.savedBy.length > 0,
    savedBy: undefined, // Remove this from the response
  }));
}

export async function getHouseById(houseId: number) {
  const userId = await getUserIdFromToken();
  
  const house = await prisma.house.findUnique({
    where: { houseId },
    include: {
      images: true,
      region: true,
      owner: true,
      savedBy: userId ? {
        where: { userId },
        select: { savedId: true }
      } : false,
    },
  });

  if (!house) return null;

  return {
    ...house,
    isDefaultFavorite: house.savedBy && house.savedBy.length > 0,
    savedBy: undefined, // Remove this from the response
  };
}

export async function searchHouses(searchTerm: string) {
  const userId = await getUserIdFromToken();

  // Try to parse the searchTerm for combined formats like "Ariana - 2080" or "Ariana Ville, Ariana, Tunisia, 2080"
  // We'll split on common separators and try to match any of the fields
  const parts = searchTerm
    .split(/[,|-]/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Build OR conditions for each part, matching any region field
  const regionOr: any[] = [];
  for (const part of parts) {
    regionOr.push(
      { region: { city: { contains: part, mode: "insensitive" } } },
      { region: { country: { contains: part, mode: "insensitive" } } },
      { region: { postalCode: { contains: part, mode: "insensitive" } } },
      { region: { regionName: { contains: part, mode: "insensitive" } } }
    );
  }

  // If no parts, fallback to original logic
  const where =
    regionOr.length > 0
      ? { OR: regionOr }
      : {
          OR: [
            { region: { city: { contains: searchTerm, mode: "insensitive" } } },
            { region: { country: { contains: searchTerm, mode: "insensitive" } } },
            { region: { postalCode: { contains: searchTerm, mode: "insensitive" } } },
            { region: { regionName: { contains: searchTerm, mode: "insensitive" } } },
          ],
        };

  const houses = await prisma.house.findMany({
    where,
    include: {
      images: true,
      region: true,
      owner: true,
      savedBy: userId
        ? {
            where: { userId },
            select: { savedId: true }
          }
        : false,
    },
  });

  return houses.map(house => ({
    ...house,
    isDefaultFavorite: house.savedBy && house.savedBy.length > 0,
    savedBy: undefined,
  }));
}

export async function getSearchSuggestions(query: string) {
  const regions = await prisma.region.findMany({
    where: {
      OR: [
        { city: { contains: query, mode: "insensitive" } },
        { country: { contains: query, mode: "insensitive" } },
        { postalCode: { contains: query, mode: "insensitive" } },
        { regionName: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      city: true,
      country: true,
      postalCode: true,
      regionName: true,
    },
    take: 10,
  });

  // Combine fields into a single suggestion string for each region
  const suggestions = new Set<string>();
  regions.forEach(r => {
    // Example formats:
    // "Ariana - 2080"
    // "Ariana Ville - Tunisia"
    // "Ariana Ville, Ariana, Tunisia, 2080"
    const combos = [
      [r.regionName, r.city, r.country, r.postalCode].filter(Boolean).join(", "),
      [r.city, r.postalCode].filter(Boolean).join(" - "),
      [r.regionName, r.city].filter(Boolean).join(" - "),
      [r.city, r.country].filter(Boolean).join(" - "),
      [r.regionName, r.country].filter(Boolean).join(" - "),
    ];
    combos.forEach(combo => {
      if (combo && combo.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(combo);
      }
    });
  });

  // Return unique, non-empty suggestions
  return Array.from(suggestions).filter(Boolean).slice(0, 10);
}

// Helper to get userId from JWT cookie
async function getUserIdFromToken(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "changeme") as { userId?: number };
    return payload.userId ?? null;
  } catch {
    return null;
  }
}

export async function getFavoriteHouses() {
  const userId = await getUserIdFromToken();
  if (!userId) return [];

  const favorites = await prisma.savedHouse.findMany({
    where: { userId },
    include: {
      house: {
        include: {
          images: true,
          region: true,
          owner: true,
        },
      },
    },
    orderBy: { dateSaved: "desc" },
  });

  return favorites.map(fav => ({
    ...fav.house,
    isFavorite: true, // Add this flag to indicate it's a favorite
    images: fav.house.images,
    region: fav.house.region,
  }));
}
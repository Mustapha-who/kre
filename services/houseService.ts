import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Helper to get userId or ownerId from JWT cookie
async function getUserOrOwnerIdFromToken(): Promise<{ userId?: number; ownerId?: number }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return {};
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "changeme") as { userId?: number; ownerId?: number };
    return { userId: payload.userId, ownerId: payload.ownerId };
  } catch {
    return {};
  }
}

export async function getHouses() {
  const { userId, ownerId } = await getUserOrOwnerIdFromToken();

  const houses = await prisma.house.findMany({
    where: {
      verificationStatus: true, // Only show verified houses
    },
    include: {
      images: true,
      region: true,
      owner: true,
      savedBy: {
        where: userId
          ? { userId }
          : ownerId
          ? { ownerId }
          : undefined,
        select: { savedId: true }
      },
    },
  });

  return houses.map(house => ({
    ...house,
    isDefaultFavorite: house.savedBy && house.savedBy.length > 0,
    savedBy: undefined,
  }));
}

export async function getHouseById(houseId: number) {
  const { userId, ownerId } = await getUserOrOwnerIdFromToken();

  const house = await prisma.house.findUnique({
    where: { houseId },
    include: {
      images: true,
      region: true,
      owner: true,
      savedBy: {
        where: userId
          ? { userId }
          : ownerId
          ? { ownerId }
          : undefined,
        select: { savedId: true }
      },
    },
  });

  if (!house) return null;

  return {
    ...house,
    isDefaultFavorite: house.savedBy && house.savedBy.length > 0,
    savedBy: undefined,
  };
}

export async function searchHouses(searchTerm: string) {
  const { userId, ownerId } = await getUserOrOwnerIdFromToken();

  const parts = searchTerm
    .split(/[,|-]/)
    .map((p) => p.trim())
    .filter(Boolean);

  const regionOr: any[] = [];
  for (const part of parts) {
    regionOr.push(
      { region: { city: { contains: part, mode: "insensitive" } } },
      { region: { country: { contains: part, mode: "insensitive" } } },
      { region: { postalCode: { contains: part, mode: "insensitive" } } },
      { region: { regionName: { contains: part, mode: "insensitive" } } }
    );
  }

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
    where: {
      AND: [
        { verificationStatus: true }, // Only show verified houses
        where
      ]
    },
    include: {
      images: true,
      region: true,
      owner: true,
      savedBy: {
        where: userId
          ? { userId }
          : ownerId
          ? { ownerId }
          : undefined,
        select: { savedId: true }
      },
    },
  });

  return houses.map(house => ({
    ...house,
    isDefaultFavorite: house.savedBy && house.savedBy.length > 0,
    savedBy: undefined,
  }));
}

export async function getFavoriteHouses() {
  const { userId, ownerId } = await getUserOrOwnerIdFromToken();
  if (!userId && !ownerId) return [];

  const favorites = await prisma.savedHouse.findMany({
    where: userId
      ? { userId }
      : ownerId
      ? { ownerId }
      : {},
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
    isFavorite: true,
    images: fav.house.images,
    region: fav.house.region,
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

export async function getHousesByLocation(country: string, city: string) {
  const { userId, ownerId } = await getUserOrOwnerIdFromToken();

  const houses = await prisma.house.findMany({
    where: {
      AND: [
        { verificationStatus: true }, // Only show verified houses
        {
          region: {
            country: { equals: country, mode: "insensitive" },
            city: { equals: city, mode: "insensitive" }
          }
        }
      ]
    },
    include: {
      images: true,
      region: true,
      owner: true,
      savedBy: {
        where: userId
          ? { userId }
          : ownerId
          ? { ownerId }
          : undefined,
        select: { savedId: true }
      },
    },
  });

  return houses.map(house => ({
    ...house,
    isDefaultFavorite: house.savedBy && house.savedBy.length > 0,
    savedBy: undefined,
  }));
}
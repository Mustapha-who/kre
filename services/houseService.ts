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
  
  const houses = await prisma.house.findMany({
    where: {
      OR: [
        { region: { city: { contains: searchTerm, mode: "insensitive" } } },
        { region: { country: { contains: searchTerm, mode: "insensitive" } } },
        { region: { postalCode: { contains: searchTerm, mode: "insensitive" } } },
        { region: { regionName: { contains: searchTerm, mode: "insensitive" } } },
      ],
    },
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
    take: 5,
  });

  // Flatten and deduplicate suggestions
  const suggestions = new Set<string>();
  regions.forEach(r => {
    if (r.city) suggestions.add(r.city);
    if (r.country) suggestions.add(r.country);
    if (r.postalCode) suggestions.add(r.postalCode);
    if (r.regionName) suggestions.add(r.regionName);
  });

  return Array.from(suggestions).filter(Boolean);
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
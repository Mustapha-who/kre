import prisma from "@/lib/prisma";

export async function getHouses() {
  return await prisma.house.findMany({
    include: {
      images: true,
      region: true,
      owner: true,
    },
  });
}

export async function getHouseById(houseId: number) {
  return await prisma.house.findUnique({
    where: { houseId },
    include: {
      images: true,
      region: true,
      owner: true,
    },
  });
}

export async function searchHouses(searchTerm: string) {
  return await prisma.house.findMany({
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
    },
  });
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

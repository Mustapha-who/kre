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

import { prisma } from "@/lib/prisma";

export type HouseWithRegion = {
  houseId: number;
  title: string;
  monthlyRent: number;
  numberOfRooms: number;
  numberOfBathrooms: number;
  furnishingStatus: string;
  isAvailable: boolean;
  verificationStatus: boolean;
  datePosted: Date;
  images: { imageId: number; imageUrl: Buffer; houseId: number }[];
  region: {
    regionName: string;
    city: string;
    country: string;
  };
};

export async function getHousesByOwnerId(ownerId: number): Promise<HouseWithRegion[]> {
  const houses = await prisma.house.findMany({
    where: { ownerId },
    select: {
      houseId: true,
      title: true,
      monthlyRent: true,
      numberOfRooms: true,
      numberOfBathrooms: true,
      furnishingStatus: true,
      isAvailable: true,
      verificationStatus: true,
      datePosted: true,
      images: {
        select: {
          imageId: true,
          imageUrl: true,
          houseId: true,
        }
      },
      region: {
        select: {
          regionName: true,
          city: true,
          country: true,
        }
      }
    },
    orderBy: { datePosted: 'desc' }
  });

  // Convert Uint8Array to Buffer for consistency
  return houses.map(house => ({
    ...house,
    images: house.images.map(img => ({
      ...img,
      imageUrl: Buffer.from(img.imageUrl)
    }))
  }));
}

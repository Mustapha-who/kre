"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function verifyHouse(houseId: number, status: boolean) {
  try {
    await prisma.house.update({
      where: { houseId },
      data: { verificationStatus: status }
    });
    
    // Revalidate the admin pages so they show updated data
    revalidatePath("/admin");
    revalidatePath("/admin/houses/verified");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update house verification:", error);
    return { success: false, error: "Failed to update verification status" };
  }
}

export async function getHouseDetailsForAdmin(houseId: number) {
  try {
    const house = await prisma.house.findUnique({
      where: { houseId },
      select: {
        houseId: true,
        title: true,
        description: true,
        monthlyRent: true,
        numberOfRooms: true,
        numberOfBathrooms: true,
        furnishingStatus: true,
        isAvailable: true,
        verificationStatus: true,
        datePosted: true,
        images: { // Fetch all image IDs for the detail view
          select: {
            imageId: true,
          }
        },
        region: {
          select: {
            regionId: true,
            regionName: true,
            city: true,
            country: true,
            postalCode: true,
            street: true,
            latitude: true,
            longitude: true,
          }
        },
        owner: {
          select: {
            ownerId: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            totalProperties: true,
          }
        },
      },
    });

    if (!house) {
      throw new Error("House not found");
    }

    return {
      ...house,
      owner: {
        ...house.owner,
        name: `${house.owner.firstName} ${house.owner.lastName}`
      }
    };
  } catch (error) {
    console.error("Failed to get house details:", error);
    throw new Error("Failed to get house details");
  }
}

export async function getAllHousesForAdmin() {
  try {
    
    
    const houses = await prisma.house.findMany({
      select: {
        houseId: true,
        title: true,
        description: true,
        monthlyRent: true,
        numberOfRooms: true,
        numberOfBathrooms: true,
        furnishingStatus: true,
        isAvailable: true,
        verificationStatus: true,
        datePosted: true,
        region: true,
        owner: {
          select: {
            ownerId: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        // Get only the ID of the first image
        images: {
          select: {
            imageId: true,
          },
          take: 1,
        },
      },
      orderBy: [
        { verificationStatus: 'asc' }, // Unverified first
        { datePosted: 'desc' }
      ],
      take: 50 // Keep a reasonable limit
    });

    

    return houses.map(house => ({
      ...house,
      owner: {
        ...house.owner,
        name: `${house.owner.firstName} ${house.owner.lastName}`
      }
    }));
  } catch (error) {
    console.error("getAllHousesForAdmin error:", error);
    throw new Error("Failed to fetch houses");
  }
}

export async function getVerifiedHouses() {
  try {
    
    
    const houses = await prisma.house.findMany({
      where: { verificationStatus: true },
      select: {
        houseId: true,
        title: true,
        description: true,
        monthlyRent: true,
        numberOfRooms: true,
        numberOfBathrooms: true,
        furnishingStatus: true,
        isAvailable: true,
        verificationStatus: true,
        datePosted: true,
        region: true,
        owner: {
          select: {
            ownerId: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        // Get only the ID of the first image
        images: {
          select: {
            imageId: true,
          },
          take: 1,
        },
      },
      orderBy: { datePosted: 'desc' },
      take: 50 // Keep a reasonable limit
    });

    

    return houses.map(house => ({
      ...house,
      owner: {
        ...house.owner,
        name: `${house.owner.firstName} ${house.owner.lastName}`
      }
    }));
  } catch (error) {
    console.error("getVerifiedHouses error:", error);
    throw new Error("Failed to fetch verified houses");
  }
}

// This function is no longer needed for the admin dashboard but can be kept
export async function getHouseImage(houseId: number) {
  try {
    const image = await prisma.houseImage.findFirst({
      where: { houseId },
      select: {
        imageId: true,
        imageUrl: true,
      },
      take: 1
    });

    if (!image) {
      return null;
    }

    return {
      imageId: image.imageId,
      imageUrl: image.imageUrl
    };
  } catch (error) {
    console.error(`Error fetching image for house ${houseId}:`, error);
    return null;
  }
}
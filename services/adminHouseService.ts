import { prisma } from "@/lib/prisma";

export async function getAllHousesForAdmin() {
  const houses = await prisma.house.findMany({
    select: {
      houseId: true,
      title: true,
      monthlyRent: true,
      verificationStatus: true,
      datePosted: true,
      images: true,
      region: true,
      owner: {
        select: {
          ownerId: true,
          firstName: true,
          lastName: true,
          email: true,
        }
      },
    },
    orderBy: [
      { verificationStatus: 'asc' }, // Unverified (false) first
      { datePosted: 'desc' }
    ]
  });

  // Transform owner data to include name for backward compatibility
  return houses.map(house => ({
    ...house,
    owner: {
      ...house.owner,
      name: `${house.owner.firstName} ${house.owner.lastName}`
    }
  }));
}

export async function updateHouseVerificationStatus(houseId: number, verificationStatus: boolean) {
  return await prisma.house.update({
    where: { houseId },
    data: { verificationStatus }
  });
}

export async function getUnverifiedHousesCount() {
  return await prisma.house.count({
    where: { verificationStatus: false }
  });
}

export async function getHousesByVerificationStatus(verified: boolean = false) {
  const houses = await prisma.house.findMany({
    where: { verificationStatus: verified },
    select: {
      houseId: true,
      title: true,
      monthlyRent: true,
      verificationStatus: true,
      datePosted: true,
      images: true,
      region: true,
      owner: {
        select: {
          ownerId: true,
          firstName: true,
          lastName: true,
          email: true,
        }
      },
    },
    orderBy: { datePosted: 'desc' }
  });

  // Transform owner data to include name for backward compatibility
  return houses.map(house => ({
    ...house,
    owner: {
      ...house.owner,
      name: `${house.owner.firstName} ${house.owner.lastName}`
    }
  }));
}

import prisma from "@/lib/prisma";

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
      owner: true,
    },
    orderBy: [
      { verificationStatus: 'asc' }, // Unverified (false) first
      { datePosted: 'desc' }
    ]
  });

  return houses;
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
  return await prisma.house.findMany({
    where: { verificationStatus: verified },
    select: {
      houseId: true,
      title: true,
      monthlyRent: true,
      verificationStatus: true,
      datePosted: true,
      images: true,
      region: true,
      owner: true,
    },
    orderBy: { datePosted: 'desc' }
  });
}

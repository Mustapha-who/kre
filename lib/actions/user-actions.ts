"use server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function getUserData() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      throw new Error("No user token found");
    }

    // Verify and decode the JWT token
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token.value, JWT_SECRET);
    } catch {
      throw new Error("Invalid user token");
    }

    // Check if it's a regular user
    if (decodedToken.userId) {
      const user = await prisma.user.findUnique({
        where: { userId: decodedToken.userId },
        select: {
          userId: true,
          email: true,
          firstName: true,
          lastName: true,
        }
      });

      if (!user) {
        throw new Error("User not found");
      }

      return {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        isHouseOwner: false,
        isAdmin: false,
      };
    }

    // Check if it's a house owner
    if (decodedToken.ownerId) {
      const owner = await prisma.houseOwner.findUnique({
        where: { ownerId: decodedToken.ownerId },
        select: {
          ownerId: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
        }
      });

      if (!owner) {
        throw new Error("House owner not found");
      }

      return {
        userId: owner.ownerId,
        ownerId: owner.ownerId,
        email: owner.email,
        firstName: owner.firstName,
        lastName: owner.lastName,
        name: `${owner.firstName} ${owner.lastName}`,
        phoneNumber: owner.phoneNumber,
        isHouseOwner: true,
        isAdmin: false,
      };
    }

    throw new Error("Invalid token data");
  } catch (error) {
    console.error("Failed to get user data:", error);
    throw new Error("Failed to get user data");
  }
}

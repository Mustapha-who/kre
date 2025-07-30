import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = jwt.verify(token, JWT_SECRET) as {
      userId?: number;
      ownerId?: number;
      email: string;
    };

    if (payload.ownerId) {
      // House owner
      const owner = await prisma.houseOwner.findUnique({
        where: { ownerId: payload.ownerId },
        select: {
          ownerId: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });

      if (!owner) {
        return NextResponse.json({ error: "Owner not found" }, { status: 404 });
      }

      return NextResponse.json({
        isHouseOwner: true,
        ownerId: owner.ownerId,
        firstName: owner.firstName,
        lastName: owner.lastName,
        name: `${owner.firstName} ${owner.lastName}`,
        email: owner.email,
      });
    } else if (payload.userId) {
      // Regular user
      const user = await prisma.user.findUnique({
        where: { userId: payload.userId },
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({
        isHouseOwner: false,
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      });
    }

    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


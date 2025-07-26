import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Corrected named import
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// Helper to get user/owner ID from token
async function getAuthPayload(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId?: number;
      ownerId?: number;
      email: string;
    };
  } catch {
    return null;
  }
}

// Add a house to favorites
export async function POST(req: NextRequest) {
  const payload = await getAuthPayload(req);
  if (!payload) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { houseId } = await req.json();
    if (!houseId) {
      return NextResponse.json({ error: "House ID is required" }, { status: 400 });
    }

    const savedHouse = await prisma.savedHouse.create({
      data: {
        houseId,
        userId: payload.userId,
        ownerId: payload.ownerId,
      },
    });

    return NextResponse.json({ success: true, savedHouse });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save house" }, { status: 500 });
  }
}

// Remove a house from favorites
export async function DELETE(req: NextRequest) {
  const payload = await getAuthPayload(req);
  if (!payload) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { houseId } = await req.json();
    if (!houseId) {
      return NextResponse.json({ error: "House ID is required" }, { status: 400 });
    }

    // Construct where clause based on whether it's a user or owner
    const whereClause = {
      houseId,
      ...(payload.userId && { userId: payload.userId }),
      ...(payload.ownerId && { ownerId: payload.ownerId }),
    };

    // Find the specific record to delete
    const savedHouse = await prisma.savedHouse.findFirst({
      where: whereClause,
    });

    if (!savedHouse) {
      return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
    }

    await prisma.savedHouse.delete({
      where: {
        savedId: savedHouse.savedId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}

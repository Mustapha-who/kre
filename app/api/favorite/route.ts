import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// Helper to get userId (for User) or ownerId (for HouseOwner) from JWT cookie
function getUserOrOwnerIdFromRequest(req: NextRequest): { userId?: number; ownerId?: number } | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId?: number; ownerId?: number };
    if (payload.userId) return { userId: payload.userId };
    if (payload.ownerId) return { ownerId: payload.ownerId };
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const ids = getUserOrOwnerIdFromRequest(req);
    if (!ids || (!ids.userId && !ids.ownerId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { houseId } = await req.json();
    if (!houseId) {
      return NextResponse.json({ error: "Missing houseId" }, { status: 400 });
    }
    // Use userId if present, otherwise ownerId
    const userField = ids.userId ? { userId: ids.userId } : { ownerId: ids.ownerId };

    // Prevent duplicate favorites
    const existing = await prisma.savedHouse.findFirst({
      where: { ...userField, houseId }
    });
    if (existing) {
      return NextResponse.json({ success: true, alreadySaved: true });
    }
    await prisma.savedHouse.create({
      data: {
        ...userField,
        houseId,
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save favorite" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const ids = getUserOrOwnerIdFromRequest(req);
    if (!ids || (!ids.userId && !ids.ownerId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { houseId } = await req.json();
    if (!houseId) {
      return NextResponse.json({ error: "Missing houseId" }, { status: 400 });
    }
    const userField = ids.userId ? { userId: ids.userId } : { ownerId: ids.ownerId };
    await prisma.savedHouse.deleteMany({
      where: { ...userField, houseId }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// Helper to get userId from JWT cookie
function getUserIdFromRequest(req: NextRequest): number | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId?: number };
    return payload.userId ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { houseId } = await req.json();
    if (!houseId) {
      return NextResponse.json({ error: "Missing houseId" }, { status: 400 });
    }
    // Prevent duplicate favorites
    const existing = await prisma.savedHouse.findFirst({
      where: { userId, houseId }
    });
    if (existing) {
      return NextResponse.json({ success: true, alreadySaved: true });
    }
    await prisma.savedHouse.create({
      data: {
        userId,
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
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { houseId } = await req.json();
    if (!houseId) {
      return NextResponse.json({ error: "Missing houseId" }, { status: 400 });
    }
    await prisma.savedHouse.deleteMany({
      where: { userId, houseId }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}

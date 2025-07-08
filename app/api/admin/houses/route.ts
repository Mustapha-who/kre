import { NextRequest, NextResponse } from "next/server";
import { getAllHousesForAdmin } from "@/services/adminHouseService";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// Helper to verify admin token
function verifyAdminToken(req: NextRequest): boolean {
  const token = req.cookies.get("admin-token")?.value;
  if (!token) return false;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { adminId?: number; role?: string };
    return payload.role === "admin" && !!payload.adminId;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAdminToken(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const houses = await getAllHousesForAdmin();
    return NextResponse.json(houses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch houses" }, { status: 500 });
  }
}

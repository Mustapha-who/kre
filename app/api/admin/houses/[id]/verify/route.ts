import { NextRequest, NextResponse } from "next/server";
import { updateHouseVerificationStatus } from "@/services/adminHouseService";
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

export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    if (!verifyAdminToken(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const houseId = Number(id);
    const { verificationStatus } = await req.json();

    if (isNaN(houseId)) {
      return NextResponse.json({ error: "Invalid house ID" }, { status: 400 });
    }

    const updatedHouse = await updateHouseVerificationStatus(houseId, verificationStatus);
    return NextResponse.json({ success: true, house: updatedHouse });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update verification status" }, { status: 500 });
  }
}

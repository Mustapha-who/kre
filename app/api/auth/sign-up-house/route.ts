import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, name, phoneNumber, password } = await req.json();

    if (!email || !name || !phoneNumber || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await prisma.houseOwner.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const owner = await prisma.houseOwner.create({
      data: {
        email: email.toLowerCase().trim(),
        name,
        phoneNumber,
        password: hashed,
      },
    });

    // Return the ownerId for redirect
    return NextResponse.json({ success: true, ownerId: owner.ownerId });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

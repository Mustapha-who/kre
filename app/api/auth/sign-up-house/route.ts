import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = "1h";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, lastName, phoneNumber, password } = await req.json();

    // Validate fields
    if (!email || !firstName || !lastName || !phoneNumber || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if email exists
    const existingOwner = await prisma.houseOwner.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingOwner) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    // Create new owner - combine firstName and lastName into name for database
    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await prisma.houseOwner.create({
      data: {
        email: email.toLowerCase().trim(),
        name: `${firstName} ${lastName}`, // Combine for database storage
        phoneNumber,
        password: hashedPassword,
        totalProperties: 0
      }
    });

    // Generate JWT token for the new house owner
    const token = jwt.sign(
      { ownerId: owner.ownerId, email: owner.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set cookie and return success (redirect will be handled client-side)
    const res = NextResponse.json({
      success: true,
      ownerId: owner.ownerId
    });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 // 1 hour
    });

    return res;

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
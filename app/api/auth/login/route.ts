import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = "1h";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase().trim() },
      select: { // Only select necessary fields
        userId: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true
      }
    });

    if (!user) {
      console.log(`User not found for email: ${email}`);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      console.log(`Invalid password for user: ${email}`);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.userId, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set cookie and return success
    const res = NextResponse.json({ 
      success: true,
      user: {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
    
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return res;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = "1h";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Try to find admin first
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        adminId: true,
        email: true,
        password: true
      }
    });

    if (admin) {
      const passwordValid = await bcrypt.compare(password, admin.password);
      if (passwordValid) {
        // Generate JWT token for admin
        const token = jwt.sign(
          { adminId: admin.adminId, email: admin.email, role: "admin" },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        const res = NextResponse.json({
          success: true,
          admin: {
            adminId: admin.adminId,
            email: admin.email
          },
          redirect: "/admin"
        });

        res.cookies.set("admin-token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60, // 1 hour
        });

        return res;
      }
    }

    // Try to find user (regular user)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        userId: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true
      }
    });

    // Try to find house owner
    const houseOwner = await prisma.houseOwner.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        ownerId: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        houses: { select: { houseId: true } }
      }
    });

    // If neither user nor houseOwner found
    if (!user && !houseOwner) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // If user found, check password and login as user
    if (user) {
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const token = jwt.sign(
        { userId: user.userId, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      const res = NextResponse.json({
        success: true,
        user: {
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        redirect: "/main"
      });
      res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      });
      return res;
    }

    // If houseOwner found, check password
    if (houseOwner) {
      const passwordValid = await bcrypt.compare(password, houseOwner.password);
      if (!passwordValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      // Check if houseOwner has at least one house
      const hasHouse = houseOwner.houses && houseOwner.houses.length > 0;

      const token = jwt.sign(
        { ownerId: houseOwner.ownerId, email: houseOwner.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // If no house, redirect to sign-up-house2
      if (!hasHouse) {
        const res = NextResponse.json({
          success: true,
          owner: {
            ownerId: houseOwner.ownerId,
            email: houseOwner.email,
            firstName: houseOwner.firstName,
            lastName: houseOwner.lastName,
            phoneNumber: houseOwner.phoneNumber
          },
          redirect: `/sign-up-house/${houseOwner.ownerId}`
        });
        res.cookies.set("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60,
        });
        return res;
      }

      // If house exists, allow login and redirect to /main
      const res = NextResponse.json({
        success: true,
        owner: {
          ownerId: houseOwner.ownerId,
          email: houseOwner.email,
          firstName: houseOwner.firstName,
          lastName: houseOwner.lastName,
          phoneNumber: houseOwner.phoneNumber
        },
        redirect: "/main"
      });
      res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      });
      return res;
    }

    // fallback
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
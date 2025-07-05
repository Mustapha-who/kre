import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // 1. Verify owner exists first
    const ownerId = Number(formData.get("ownerId"));
    if (isNaN(ownerId)) {
      return NextResponse.json(
        { error: "Invalid owner ID" },
        { status: 400 }
      );
    }

    const owner = await prisma.houseOwner.findUnique({
      where: { ownerId }
    });

    if (!owner) {
      return NextResponse.json(
        { error: "Owner not found" },
        { status: 404 }
      );
    }

    // 2. Parse form data exactly as per schema
    const requiredFields = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      monthlyRent: parseFloat(formData.get("monthlyRent") as string),
      numberOfRooms: parseInt(formData.get("numberOfRooms") as string, 10),
      numberOfBathrooms: parseInt(formData.get("numberOfBathrooms") as string, 10),
      furnishingStatus: formData.get("furnishingStatus") as string || "Unspecified",
      city: formData.get("city") as string,
      country: formData.get("country") as string,
      regionName: formData.get("regionName") as string,
      postalCode: formData.get("postalCode") as string,
      street: formData.get("street") as string,
      latitude: formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : undefined,
      longitude: formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : undefined,
      images: formData.getAll("images") as File[]
    };

    // 3. Validate required fields
    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === null || value === undefined || 
          (typeof value === 'number' && isNaN(value)) ||
          (typeof value === 'string' && !value.trim())) {
        return NextResponse.json(
          { error: `Missing or invalid required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // 4. Handle region exactly as per schema
    let region = await prisma.region.findFirst({
      where: {
        regionName: requiredFields.regionName,
        city: requiredFields.city,
        country: requiredFields.country,
        postalCode: requiredFields.postalCode,
        street: requiredFields.street,
      },
    });

    if (!region) {
      region = await prisma.region.create({
        data: {
          regionName: requiredFields.regionName,
          city: requiredFields.city,
          country: requiredFields.country,
          postalCode: requiredFields.postalCode,
          street: requiredFields.street,
          latitude: requiredFields.latitude,
          longitude: requiredFields.longitude,
        },
      });
    } else {
      // Optionally update region with new lat/lng/street if missing
      await prisma.region.update({
        where: { regionId: region.regionId },
        data: {
          street: requiredFields.street,
          latitude: requiredFields.latitude,
          longitude: requiredFields.longitude,
        },
      });
    }

    // 5. Create house record exactly matching schema
    const house = await prisma.house.create({
      data: {
        title: requiredFields.title,
        description: requiredFields.description,
        monthlyRent: requiredFields.monthlyRent,
        numberOfRooms: requiredFields.numberOfRooms,
        numberOfBathrooms: requiredFields.numberOfBathrooms,
        furnishingStatus: requiredFields.furnishingStatus,
        isAvailable: true, // Default as per schema
        datePosted: new Date(), // Default as per schema
        ownerId: owner.ownerId,
        regionId: region.regionId,
      },
    });

    // 6. Process images using exactly the HouseImage model structure
    for (const img of requiredFields.images) {
      if (img.size > 5 * 1024 * 1024) continue; // Skip if >5MB

      const arrayBuffer = await img.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await prisma.houseImage.create({
        data: {
          imageUrl: buffer, // Exactly matching schema's Bytes type
          houseId: house.houseId,
        },
      });
    }

    // 7. Update owner's totalProperties as per schema
    await prisma.houseOwner.update({
      where: { ownerId: owner.ownerId },
      data: { totalProperties: { increment: 1 } }
    });

    return NextResponse.json({ 
      success: true, 
      houseId: house.houseId 
    });

  } catch (error: any) {
    console.error("House submission error:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "A house with these details already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to submit house",
        ...(process.env.NODE_ENV === 'development' && { 
          details: error.message 
        })
      }, 
      { status: 500 }
    );
  }
}
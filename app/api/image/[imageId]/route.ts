import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    // Await the params object to access its properties
    const { imageId } = await params;
    const id = parseInt(imageId, 10);
    if (isNaN(id)) {
      return new NextResponse("Invalid image ID", { status: 400 });
    }

    const image = await prisma.houseImage.findUnique({
      where: { imageId: id },
      select: { imageUrl: true },
    });

    if (!image || !image.imageUrl) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // Get the buffer from the database
    const buffer = Buffer.from(image.imageUrl);

    // Return the image with the correct content type and cache headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg", // Assuming images are JPEGs
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(`Failed to fetch image ${params.imageId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

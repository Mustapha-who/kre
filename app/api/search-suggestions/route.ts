import { NextRequest, NextResponse } from "next/server";
import { getSearchSuggestions } from "@/services/houseService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = await getSearchSuggestions(query);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Failed to fetch search suggestions:", error);
    return NextResponse.json({ suggestions: [] });
  }
}

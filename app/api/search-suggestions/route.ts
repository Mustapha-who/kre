import { NextRequest, NextResponse } from "next/server";
import { getSearchSuggestions } from "@/services/houseService";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") || "";
  if (!q) return NextResponse.json([]);
  const suggestions = await getSearchSuggestions(q);
  return NextResponse.json(suggestions);
}

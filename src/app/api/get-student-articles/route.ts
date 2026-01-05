import { getPosts } from "@/lib/dbServer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions"; 
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "25", 10);
  const startAfter = url.searchParams.get("startAfter") || undefined;

  try {
    const articles = await getPosts( "student-articles", limit, startAfter);
    
    return NextResponse.json(articles);
  } catch (err: any) {
    console.error("GET articles error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

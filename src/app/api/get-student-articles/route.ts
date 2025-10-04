import { getPosts } from "@/lib/DatabaseOperations";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
  
   const articles = await getPosts("student-articles")

   if (articles) {
    return NextResponse.json(articles);
  }

  return NextResponse.json({error: "Articles do not exist"}, {status: 404});
}

  
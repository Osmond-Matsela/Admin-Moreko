import { getPosts } from "@/lib/DatabaseOperations";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  
   const articles = await getPosts("content")

   if (articles) {
    return NextResponse.json(articles);
  }

  return NextResponse.json({error: "Articles do not exist"}, {status: 404});
}

  
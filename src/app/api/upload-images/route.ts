import { addPost } from "@/lib/DatabaseOperations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const articleSent = await addPost("content", data);

  if (!articleSent) {
    return NextResponse.json({error: "Failed to add article"}, {status: 404});
  }
  else{
    return NextResponse.json({message: "Article added successfully"}, {status: 200});
  }

  
  }
  
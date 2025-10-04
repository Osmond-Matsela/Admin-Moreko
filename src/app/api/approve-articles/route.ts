import { addPost, deleteArticle } from "@/lib/DatabaseOperations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();

    try{
        await addPost("posts", data);
        await deleteArticle("student-articles", data.id);
        return NextResponse.json({message: "Article approved successfully"}, {status: 200});
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

  
  }
  
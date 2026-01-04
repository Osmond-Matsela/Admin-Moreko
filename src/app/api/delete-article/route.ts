

import { deleteArticle } from "@/lib/dbServer";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
    const data = await request.json();
    


   
    try{
         const user =  await deleteArticle(data.id);

        return NextResponse.json({ message: "Article deleted successfully" }, { status: 200 });
    }catch(e){
        return NextResponse.json({ error: "Article does not exist" }, { status: 404 });
    }
}

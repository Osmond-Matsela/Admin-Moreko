
import { deleteParent } from "@/lib/DatabaseOperations";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
    const data = await request.json();
    


    const user =  await deleteParent("parent", data.id);

    if (!user) {
        return NextResponse.json({error: "User does not exist"}, {status: 404});
    }
    else{
        return NextResponse.json({message: "Parent deleted successfully"}, {status: 200});
    }
}

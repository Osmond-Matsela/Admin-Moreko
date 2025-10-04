
import { addParent} from "@/lib/DatabaseOperations";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();

    const user =  await addParent("parent", data);
    console.log(data)
    if (!user) {
        return NextResponse.json({error: "Failed to add parent"}, {status: 404});
    }
    else{
        return NextResponse.json({message: "Parents added successfully"}, {status: 200});
    }
}

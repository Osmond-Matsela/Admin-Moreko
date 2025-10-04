
import { getParents } from "@/lib/DatabaseOperations";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {

  const user = await getParents("parent");

  if (user) {
    return NextResponse.json(user);
  }

  return NextResponse.json({error: "User does not exist"}, {status: 404});
  
}

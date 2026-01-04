

import { getParents } from "@/lib/dbServer";
import { NextResponse } from "next/server";

export async function GET() {

  const user = await getParents();

  if (user) {
    return NextResponse.json(user);
  }

  return NextResponse.json({error: "User does not exist"}, {status: 404});
  
}

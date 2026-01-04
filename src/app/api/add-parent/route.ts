// app/api/parents/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions"; 
import { addParents } from "@/lib/dbServer";

export async function POST(request: NextRequest) {
  // check session
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // optional: enforce admin role
  if (!session.user.role || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const parentsData = await request.json();

    const success = await addParents(parentsData);

    if (!success) {
      return NextResponse.json({ error: "Failed to add parents" }, { status: 500 });
    }

    return NextResponse.json({ message: "Parents added successfully" });
  } catch (err: any) {
    console.log(err)
    return NextResponse.json({ error: err.message }, { status: 300 });
  }
}

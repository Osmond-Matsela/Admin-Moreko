
import { addUser } from "@/lib/dbServer";
import { NextRequest, NextResponse } from "next/server";

const bcrypt = require("bcrypt");

export async function POST(request: NextRequest) {
  const data = await request.json();

  data.password = await bcrypt.hash(data.password, 10);
  const { confirmPassword, ...user } = data;

  try {
    await addUser(user);
    return NextResponse.json({ message: "User added successfully" }, { status: 200 });
  }
  catch (e) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  
}

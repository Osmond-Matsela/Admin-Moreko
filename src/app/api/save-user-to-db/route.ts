
import { addUser, findUser, getUser } from "@/lib/dbServer";
import { NextRequest, NextResponse } from "next/server";

const bcrypt = require("bcrypt");

export async function POST(request: NextRequest) {
  const data = await request.json();

  data.password = await bcrypt.hash(data.password, 10);
  const { confirmPassword, ...user } = data;

  try {
    const userFound = await getUser("admin", data.email);
    
    if (userFound !== null) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    await addUser(user);
    return NextResponse.json({ message: "User added successfully" }, { status: 200 });
  }
  catch (e) {
    console.log(e)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  
}

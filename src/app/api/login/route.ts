// app/api/auth/login/route.ts
import { findUser, getUser } from "@/lib/dbServer"; 
import { signJwtAccessToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
const bcrypt = require("bcrypt");

// Since schemas are already validated in DB functions, we only check basic presence
export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  try {
    const user = await findUser("admin", email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const userFound = await getUser("admin", email);
    const passwordMatches = await bcrypt.compare(password, userFound.password);
    if (!passwordMatches) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Whitelist safe fields for client
    const safeUser = {
      id: userFound.id,
      email: userFound.email,
      name: userFound.name,
      role: userFound.role,
    };

    const accessToken = signJwtAccessToken(safeUser);

    return NextResponse.json({ ...safeUser, accessToken });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { addData, userExists } from "@/lib/DatabaseOperations";
const bcrypt = require("bcrypt");

export async function POST(request: NextRequest) {
  const data = await request.json();

  data.password = await bcrypt.hash(data.password, 10);
  const { confirmPassword, ...user } = data;

  if (!await userExists("user", data.email)) {
    await addData("user", user, user.id);
    const { password, ...result } = user;
    
    return NextResponse.redirect(new URL(`/login?username=${result.email.toLowerCase().replace(/\s+/g, '-')}`, process.env.NEXT_PUBLIC_BASE_URL), {
        status: 302 
    })
   
  }
    
    return NextResponse.json({error: "User already exists"}, {status: 409});
  
}

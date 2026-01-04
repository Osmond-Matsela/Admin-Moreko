import { deleteParent } from "@/lib/dbServer";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  try {
    const user = await deleteParent(data.id);

    return NextResponse.json(
      { message: "Parent deleted successfully" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: "User does not exist" }, { status: 404 });
  }
}

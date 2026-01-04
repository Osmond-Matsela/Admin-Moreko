import { updateParent } from "@/lib/dbServer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, updates } = await req.json();

    if (!id || !updates) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await updateParent(id, updates);

    return NextResponse.json({ id: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

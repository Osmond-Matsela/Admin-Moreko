import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";


import { z } from "zod";
import { authOptions } from "@/lib/AuthOptions";
import { addPosts, deleteArticle } from "@/lib/dbServer";

const ApprovePostSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  authorId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const userRole = (session.user as any).role;
  if (!["admin", "moderator"].includes(userRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parseResult = ApprovePostSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid data", details: parseResult.error.format() }, { status: 400 });
  }

  const postData: any = parseResult.data;

  try {
    // Optionally run as a transaction if addPost and deleteArticle need atomicity
    await addPosts(postData);
    await deleteArticle(postData.id);

    return NextResponse.json({ message: "Article approved successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

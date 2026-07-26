import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage";
import { isAuthenticated } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const key = `books/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const url = await uploadFile(key, file);

  return NextResponse.json({ url });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await req.json();

  try {
    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        title: data.title,
        price: Number(data.price),
        cover: data.cover,
        description: data.description,
        pages: Number(data.pages),
        age: data.age,
        preview: data.preview ?? [],
        videoUrl: data.videoUrl || null,
      },
    });

    return NextResponse.json(book);
  } catch (err) {
    console.error("Failed to update book:", err);
    return NextResponse.json(
      {
        error: "Failed to update book",
        // Raw Prisma messages leak table/column names — dev only.
        ...(process.env.NODE_ENV !== "production" && {
          detail: err instanceof Error ? err.message : String(err),
        }),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.book.delete({ where: { id: Number(id) } });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

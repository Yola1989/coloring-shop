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
    },
  });

  return NextResponse.json(book);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.book.delete({ where: { id: Number(id) } });

  return NextResponse.json({ ok: true });
}

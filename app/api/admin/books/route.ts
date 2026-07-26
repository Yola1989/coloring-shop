import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const books = await prisma.book.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const book = await prisma.book.create({
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

  return NextResponse.json(book, { status: 201 });
}

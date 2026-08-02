import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const books = await prisma.book.findMany({
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  try {
    const book = await prisma.book.create({
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

    return NextResponse.json(book, { status: 201 });
  } catch (err) {
    console.error("Failed to create book:", err);
    return NextResponse.json(
      {
        error: "Failed to create book",
        // Raw Prisma messages leak table/column names — dev only.
        ...(process.env.NODE_ENV !== "production" && {
          detail: err instanceof Error ? err.message : String(err),
        }),
      },
      { status: 500 }
    );
  }
}

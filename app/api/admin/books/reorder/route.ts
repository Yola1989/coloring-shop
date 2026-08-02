import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// Moves one book up or down by swapping it with its neighbour, then rewrites
// every position as 1..n. Normalising on each move means books created before
// this feature existed (all position = 0) settle into a stable order instead
// of jumping around.
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { id, direction } = (body ?? {}) as {
    id?: unknown;
    direction?: unknown;
  };
  const bookId = Number(id);

  if (!Number.isInteger(bookId) || bookId <= 0) {
    return NextResponse.json(
      { error: "A valid book id is required." },
      { status: 400 }
    );
  }

  if (direction !== "up" && direction !== "down") {
    return NextResponse.json(
      { error: 'direction must be "up" or "down".' },
      { status: 400 }
    );
  }

  try {
    const books = await prisma.book.findMany({
      orderBy: [{ position: "asc" }, { id: "asc" }],
      select: { id: true },
    });

    const index = books.findIndex((b) => b.id === bookId);
    if (index === -1) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= books.length) {
      return NextResponse.json({ ok: true, moved: false });
    }

    const reordered = books.slice();
    const swap = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = swap;

    await prisma.$transaction(
      reordered.map((b, i) =>
        prisma.book.update({
          where: { id: b.id },
          data: { position: i + 1 },
        })
      )
    );

    return NextResponse.json({ ok: true, moved: true });
  } catch (err) {
    console.error("Failed to reorder books:", err);
    return NextResponse.json(
      {
        error: "Failed to reorder books",
        // Raw Prisma messages leak table/column names — dev only.
        ...(process.env.NODE_ENV !== "production" && {
          detail: err instanceof Error ? err.message : String(err),
        }),
      },
      { status: 500 }
    );
  }
}

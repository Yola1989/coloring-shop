import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// The store only ever needs one homepage promotion, so we always work
// with the first row (creating it on first access) instead of building
// a full CRUD list.
async function getOrCreatePromotion() {
  const existing = await prisma.promotion.findFirst();
  if (existing) return existing;

  return prisma.promotion.create({ data: {} });
}

export async function GET() {
  const promotion = await getOrCreatePromotion();
  return NextResponse.json(promotion);
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const current = await getOrCreatePromotion();

  try {
    const promotion = await prisma.promotion.update({
      where: { id: current.id },
      data: {
        enabled: Boolean(data.enabled),
        title: data.title || "",
        description: data.description || "",
        book1Id: data.book1Id ? Number(data.book1Id) : null,
        book1Price: data.book1Price ? Number(data.book1Price) : null,
        book2Id: data.book2Id ? Number(data.book2Id) : null,
        book2Price: data.book2Price ? Number(data.book2Price) : null,
      },
    });

    return NextResponse.json(promotion);
  } catch (err) {
    console.error("Failed to update promotion:", err);
    return NextResponse.json(
      {
        error: "Failed to update promotion",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

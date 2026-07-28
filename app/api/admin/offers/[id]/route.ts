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
    const offer = await prisma.specialOffer.update({
      where: { id: Number(id) },
      data: {
        enabled: Boolean(data.enabled),
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        price: Number(data.price),
        oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
        position: Number(data.position ?? 0),
      },
    });

    return NextResponse.json(offer);
  } catch (err) {
    console.error("Failed to update offer:", err);
    return NextResponse.json(
      {
        error: "Failed to update offer",
        detail: err instanceof Error ? err.message : String(err),
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
  await prisma.specialOffer.delete({ where: { id: Number(id) } });

  return NextResponse.json({ ok: true });
}

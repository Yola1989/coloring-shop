import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const offers = await prisma.specialOffer.findMany({
    orderBy: { position: "asc" },
  });
  return NextResponse.json(offers);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  try {
    const offer = await prisma.specialOffer.create({
      data: {
        enabled: Boolean(data.enabled),
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        price: Number(data.price),
        oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
        pickEnabled: Boolean(data.pickEnabled),
        pickCount: Number(data.pickCount ?? 0),
        position: Number(data.position ?? 0),
      },
    });

    return NextResponse.json(offer, { status: 201 });
  } catch (err) {
    console.error("Failed to create offer:", err);
    return NextResponse.json(
      {
        error: "Failed to create offer",
        // Raw Prisma messages leak table/column names — dev only.
        ...(process.env.NODE_ENV !== "production" && {
          detail: err instanceof Error ? err.message : String(err),
        }),
      },
      { status: 500 }
    );
  }
}

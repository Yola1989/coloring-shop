import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// Same single-row pattern as Promotion — the store only needs one
// settings record.
async function getOrCreateSettings() {
  const existing = await prisma.settings.findFirst();
  if (existing) return existing;

  return prisma.settings.create({ data: {} });
}

export async function GET() {
  const settings = await getOrCreateSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const current = await getOrCreateSettings();

  try {
    const settings = await prisma.settings.update({
      where: { id: current.id },
      data: {
        whatsappNumber: data.whatsappNumber || "",
        homepageVideoUrl: data.homepageVideoUrl || "",
        upsellEnabled: Boolean(data.upsellEnabled),
        // A negative or nonsense price would silently break the cart total.
        upsellPrice: Math.max(0, Math.floor(Number(data.upsellPrice) || 0)),
        upsellTitle: data.upsellTitle || "",
        upsellSubtitle: data.upsellSubtitle || "",
      },
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error("Failed to update settings:", err);
    return NextResponse.json(
      {
        error: "Failed to update settings",
        // Raw Prisma messages leak table/column names — dev only.
        ...(process.env.NODE_ENV !== "production" && {
          detail: err instanceof Error ? err.message : String(err),
        }),
      },
      { status: 500 }
    );
  }
}

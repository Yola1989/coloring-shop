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
      },
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error("Failed to update settings:", err);
    return NextResponse.json(
      {
        error: "Failed to update settings",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

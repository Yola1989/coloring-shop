import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPromotionPriceMap,
  getEffectivePrice,
  getUpsellConfig,
} from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getUpsellConfig();

  if (!config.enabled) {
    return NextResponse.json({ ...config, books: [] });
  }

  const promoMap = await getPromotionPriceMap();

  const books = await prisma.book.findMany({
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });

  // Only books the offer actually improves: nothing already on Promotion,
  // and nothing that costs less than the upsell price to begin with.
  const eligible = books
    .map((book) => ({
      id: book.id,
      title: book.title,
      cover: book.cover,
      price: getEffectivePrice(book.id, book.price, promoMap),
      normalPrice: book.price,
    }))
    .filter(
      (book) => book.price === book.normalPrice && book.price > config.price
    )
    .map(({ id, title, cover, price }) => ({ id, title, cover, price }));

  return NextResponse.json({ ...config, books: eligible });
}

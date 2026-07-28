import { prisma } from "@/lib/prisma";

// Single source of truth for "what does this book actually cost right
// now". Used by every page/route that shows or charges a book price
// (homepage, book details, cart snapshot, order creation) so the
// Promotion Price stays consistent everywhere and automatically falls
// back to the normal price when the promotion is disabled.
export async function getPromotionPriceMap(): Promise<Map<number, number>> {
  const promotion = await prisma.promotion.findFirst();
  const map = new Map<number, number>();

  if (!promotion?.enabled) return map;

  if (promotion.book1Id && promotion.book1Price != null) {
    map.set(promotion.book1Id, promotion.book1Price);
  }

  if (promotion.book2Id && promotion.book2Price != null) {
    map.set(promotion.book2Id, promotion.book2Price);
  }

  return map;
}

export function getEffectivePrice(
  bookId: number,
  normalPrice: number,
  promoMap: Map<number, number>
): number {
  return promoMap.get(bookId) ?? normalPrice;
}

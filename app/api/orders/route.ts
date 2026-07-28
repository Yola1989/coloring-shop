import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/orderNumber";
import { sendNewOrderEmail } from "@/lib/email";
import { getPromotionPriceMap, getEffectivePrice } from "@/lib/pricing";

type CartInput = {
  id: number;
  type?: "book" | "offer";
  quantity: number;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fullName, phone, city, address, notes, cart } = body as {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
    cart: CartInput[];
  };

  if (!fullName || !phone || !city || !address) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Always re-fetch prices/titles from the DB — never trust the client,
  // so prices can't be tampered with in the browser. Books and offers
  // are looked up separately since they're different tables.
  const bookInputs = cart.filter((c) => (c.type ?? "book") === "book");
  const offerInputs = cart.filter((c) => c.type === "offer");

  const books = bookInputs.length
    ? await prisma.book.findMany({
        where: { id: { in: bookInputs.map((c) => c.id) } },
      })
    : [];

  const offers = offerInputs.length
    ? await prisma.specialOffer.findMany({
        where: { id: { in: offerInputs.map((c) => c.id) }, enabled: true },
      })
    : [];

  if (books.length === 0 && offers.length === 0) {
    return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
  }

  const promoMap = await getPromotionPriceMap();

  const bookItems = bookInputs
    .map((c) => {
      const book = books.find((b) => b.id === c.id);
      if (!book) return null;
      return {
        bookId: book.id as number | null,
        offerId: null as number | null,
        title: book.title,
        price: getEffectivePrice(book.id, book.price, promoMap),
        quantity: Math.max(1, Math.floor(c.quantity)),
      };
    })
    .filter((i): i is NonNullable<typeof i> => i !== null);

  const offerItems = offerInputs
    .map((c) => {
      const offer = offers.find((o) => o.id === c.id);
      if (!offer) return null;
      return {
        bookId: null as number | null,
        offerId: offer.id as number | null,
        title: offer.title,
        price: offer.price,
        quantity: Math.max(1, Math.floor(c.quantity)),
      };
    })
    .filter((i): i is NonNullable<typeof i> => i !== null);

  const items = [...bookItems, ...offerItems];

  if (items.length === 0) {
    return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
  }

  const totalAmount = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      fullName,
      phone,
      city,
      address,
      notes: notes || null,
      totalAmount,
      status: "NEW",
      items: {
        create: items.map((i) => ({
          bookId: i.bookId,
          offerId: i.offerId,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
        })),
      },
    },
    include: { items: true },
  });

  // Don't let an email failure block the order from being placed.
  try {
    await sendNewOrderEmail({
      orderNumber: order.orderNumber,
      fullName: order.fullName,
      phone: order.phone,
      city: order.city,
      address: order.address,
      notes: order.notes,
      items: order.items.map((i) => ({
        title: i.title,
        price: i.price,
        quantity: i.quantity,
      })),
      totalAmount: order.totalAmount,
    });
  } catch (err) {
    console.error("Failed to send order email:", err);
  }

  return NextResponse.json(
    { orderNumber: order.orderNumber },
    { status: 201 }
  );
}

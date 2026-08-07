import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/orderNumber";
import { sendNewOrderEmail } from "@/lib/email";
import {
  getPromotionPriceMap,
  getEffectivePrice,
  getUpsellConfig,
} from "@/lib/pricing";
import { applyUpsellPricing } from "@/lib/upsell";

type CartInput = {
  id: number;
  type?: "book" | "offer";
  quantity: number;
  // Book ids chosen for an offer that lets the customer pick.
  selection?: number[];
};

// Moroccan numbers: 05/06/07 + 8 digits, or the +212 international form.
const PHONE_RE = /^(?:\+212|0)[5-7]\d{8}$/;

export async function POST(req: NextRequest) {
  // A malformed body must not crash the route with an unhandled rejection.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  const { fullName, phone, city, address, notes, cart } = (body ?? {}) as {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
    cart: CartInput[];
  };

  if (!fullName || !phone || !city || !address) {
    return NextResponse.json(
      { error: "المرجو ملء جميع الحقول المطلوبة." },
      { status: 400 }
    );
  }

  // Never trust client-side validation alone.
  const cleanPhone = String(phone).replace(/[\s.\-()]/g, "");
  if (!PHONE_RE.test(cleanPhone)) {
    return NextResponse.json(
      { error: "رقم الهاتف غير صحيح. مثال: 0612345678" },
      { status: 400 }
    );
  }

  if (String(fullName).trim().length < 3) {
    return NextResponse.json(
      { error: "المرجو إدخال الاسم الكامل." },
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
        selection: null as string | null,
      };
    })
    .filter((i): i is NonNullable<typeof i> => i !== null);

  // Titles for "pick your own books" offers are read from the database too,
  // so the packing list can never be edited from the browser.
  const pickedBookIds = Array.from(
    new Set(
      offerInputs.flatMap((c) =>
        Array.isArray(c.selection) ? c.selection.map(Number) : []
      )
    )
  );

  const pickedBooks = pickedBookIds.length
    ? await prisma.book.findMany({
        where: { id: { in: pickedBookIds } },
        select: { id: true, title: true },
      })
    : [];

  let selectionError = "";

  const offerItems = offerInputs
    .map((c) => {
      const offer = offers.find((o) => o.id === c.id);
      if (!offer) return null;

      let selection: string | null = null;

      if (offer.pickEnabled && offer.pickCount > 0) {
        const ids = Array.from(
          new Set((Array.isArray(c.selection) ? c.selection : []).map(Number))
        );

        const titles = ids
          .map((bookId) => pickedBooks.find((b) => b.id === bookId)?.title)
          .filter((t): t is string => Boolean(t));

        // Refusing the order beats shipping a bundle nobody can identify.
        if (titles.length !== offer.pickCount) {
          selectionError = "المرجو اختيار الكتب قبل إتمام الطلب.";
          return null;
        }

        selection = titles.join(" • ");
      }

      return {
        bookId: null as number | null,
        offerId: offer.id as number | null,
        title: offer.title,
        price: offer.price,
        quantity: Math.max(1, Math.floor(c.quantity)),
        selection,
      };
    })
    .filter((i): i is NonNullable<typeof i> => i !== null);

  if (selectionError) {
    return NextResponse.json({ error: selectionError }, { status: 400 });
  }

  const items = [...bookItems, ...offerItems];

  if (items.length === 0) {
    return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
  }

  // The browser is never trusted with the offer either - the same shared
  // rule runs again here and decides the real amount owed.
  const upsellConfig = await getUpsellConfig();

  const pricing = applyUpsellPricing(
    items.map((item, index) => ({
      key: String(index),
      isBook: item.bookId !== null,
      promoApplied: item.bookId !== null && promoMap.has(item.bookId),
      unitPrice: item.price,
      quantity: item.quantity,
    })),
    upsellConfig
  );

  // A book bought at two different prices becomes two order lines, so the
  // invoice stays honest instead of averaging the prices together.
  const finalItems = items.flatMap((item, index) =>
    pricing.lines[index].groups.map((group) => ({
      bookId: item.bookId,
      offerId: item.offerId,
      title: item.title,
      price: group.price,
      quantity: group.quantity,
      selection: item.selection,
    }))
  );

  const totalAmount = pricing.total;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      fullName: String(fullName).trim(),
      phone: cleanPhone,
      city,
      address,
      notes: notes || null,
      totalAmount,
      status: "NEW",
      items: {
        create: finalItems.map((i) => ({
          bookId: i.bookId,
          offerId: i.offerId,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          selection: i.selection,
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
        selection: i.selection,
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

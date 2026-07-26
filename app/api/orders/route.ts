import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/orderNumber";
import { sendNewOrderEmail } from "@/lib/email";

type CartInput = {
  id: number;
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
  // so prices can't be tampered with in the browser.
  const bookIds = cart.map((c) => c.id);
  const books = await prisma.book.findMany({
    where: { id: { in: bookIds } },
  });

  if (books.length === 0) {
    return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
  }

  const items = cart
    .map((c) => {
      const book = books.find((b) => b.id === c.id);
      if (!book) return null;
      return {
        bookId: book.id,
        title: book.title,
        price: book.price,
        quantity: Math.max(1, Math.floor(c.quantity)),
      };
    })
    .filter((i): i is NonNullable<typeof i> => i !== null);

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

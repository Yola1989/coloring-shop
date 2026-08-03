"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useUpsellData, type UpsellBook } from "@/lib/upsellClient";

type UpsellSectionProps = {
  /** Hide the book the visitor is already looking at. */
  excludeBookId?: number;
  className?: string;
};

// Lets the customer pick which extra book they want at the offer price.
// Renders nothing when the offer is off, or once every eligible book is
// already in the cart.
export default function UpsellSection({
  excludeBookId,
  className = "",
}: UpsellSectionProps) {
  const data = useUpsellData();
  const { cart, addToCart } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);

  function handleAdd(book: UpsellBook) {
    // The full price goes into the cart. The offer is applied to the totals
    // by the shared rule, so the discount never lands on the wrong book.
    addToCart({
      id: book.id,
      type: "book",
      title: book.title,
      price: book.price,
      cover: book.cover,
    });

    setAddedId(book.id);
    setTimeout(() => setAddedId(null), 2000);
  }

  if (!data || !data.enabled) return null;

  const inCart = new Set(
    cart.filter((item) => item.type === "book").map((item) => item.id)
  );

  const books = data.books.filter(
    (book) => book.id !== excludeBookId && !inCart.has(book.id)
  );

  if (books.length === 0) return null;

  // The offer starts from the SECOND book, so the strip must not promise the
  // discounted price until a first book qualifies. A special offer sitting in
  // the cart is not a book and never counts towards it.
  const eligibleIds = new Set(data.books.map((item) => item.id));

  const bookUnitsInCart = cart.reduce(
    (sum, item) =>
      item.type === "book" && eligibleIds.has(item.id)
        ? sum + item.quantity
        : sum,
    0
  );

  // On a book page the visitor has not pressed Add to Cart yet, but this
  // strip sits right under that button, so treat that book as the first one.
  const pendingBook =
    typeof excludeBookId === "number" && eligibleIds.has(excludeBookId) ? 1 : 0;

  // A Special Offer in the cart already counts as the first purchase, so the
  // very next book earns the offer price with no second book needed.
  const hasOfferInCart = cart.some((item) => item.type !== "book");

  const discountApplies = hasOfferInCart || bookUnitsInCart + pendingBook >= 1;

  const needsThisBook =
    discountApplies && !hasOfferInCart && bookUnitsInCart === 0;

  return (
    <section
      dir="rtl"
      className={
        "w-full min-w-0 max-w-full overflow-hidden rounded-3xl border-2 border-dashed border-orange-300 bg-orange-50 p-4 sm:p-6 " +
        className
      }
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h2 className="text-base font-bold text-gray-900 sm:text-xl">
          🎁 {data.title}
        </h2>
        <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white sm:text-sm">
          {data.price} د.م
        </span>
      </div>

      {data.subtitle && (
        <p className="mt-1 text-xs text-gray-600 sm:text-sm">{data.subtitle}</p>
      )}

      {!discountApplies && (
        <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-orange-700">
          ⚠️ زيد جوج كتب باش يتفعّل العرض
        </p>
      )}

      {needsThisBook && (
        <p className="mt-2 text-xs font-semibold text-orange-700">
          مع هاد الكتاب
        </p>
      )}

      {/* No negative margins here: they made this row wider than the page
          itself, which broke the layout and killed the swipe. */}
      <div className="mt-4 flex w-full snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
        {books.map((book) => (
          <div
            key={book.id}
            className="w-36 shrink-0 snap-start rounded-2xl border border-gray-200 bg-white p-2 sm:w-40"
          >
            <div className="relative h-32 w-full overflow-hidden rounded-xl sm:h-36">
              <Image
                src={book.cover}
                alt={book.title}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>

            <h3 className="mt-2 line-clamp-2 break-words text-xs font-bold text-gray-900">
              {book.title}
            </h3>

            <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
              {discountApplies ? (
                <>
                  <span className="text-sm font-bold text-orange-600">
                    {data.price} د.م
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {book.price} د.م
                  </span>
                </>
              ) : (
                <span className="text-sm font-bold text-gray-900">
                  {book.price} د.م
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleAdd(book)}
              aria-live="polite"
              className={
                "mt-2 w-full rounded-xl py-2 text-xs font-semibold text-white transition " +
                (addedId === book.id
                  ? "bg-green-600"
                  : "bg-orange-500 hover:bg-orange-600")
              }
            >
              {addedId === book.id ? "✅ تمت الإضافة" : "أضف"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

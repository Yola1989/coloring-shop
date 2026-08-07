"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export type PickableBook = {
  id: number;
  title: string;
  cover: string;
};

type Props = {
  offerId: number;
  offerTitle: string;
  offerPrice: number;
  offerImage: string;
  pickCount: number;
  books: PickableBook[];
};

export default function OfferBookPicker({
  offerId,
  offerTitle,
  offerPrice,
  offerImage,
  pickCount,
  books,
}: Props) {
  const { addToCart } = useCart();
  const [picked, setPicked] = useState<number[]>([]);
  const [added, setAdded] = useState(false);

  const remaining = pickCount - picked.length;
  const complete = remaining <= 0;

  function toggle(id: number) {
    setAdded(false);

    setPicked((prev) => {
      if (prev.includes(id)) {
        return prev.filter((b) => b !== id);
      }

      // Once the quota is full the remaining covers are visibly disabled,
      // so an extra tap is ignored rather than silently swapping a choice.
      if (prev.length >= pickCount) {
        return prev;
      }

      return [...prev, id];
    });
  }

  function handleAdd() {
    if (!complete) return;

    const selection = picked
      .map((id) => books.find((b) => b.id === id))
      .filter((b): b is PickableBook => Boolean(b))
      .map((b) => ({ id: b.id, title: b.title }));

    addToCart({
      id: offerId,
      type: "offer",
      title: offerTitle,
      price: offerPrice,
      cover: offerImage,
      selection,
    });

    // Clearing the picks lets the customer immediately build a second
    // bundle with different books instead of hunting for a reset button.
    setPicked([]);
    setAdded(true);

    setTimeout(() => setAdded(false), 3000);
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <div dir="rtl" className="w-full min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-gray-900 sm:text-base">
          اختار {pickCount} كتب
        </p>

        <span
          className={
            complete
              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"
              : "rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700"
          }
        >
          {complete ? "✅ كمّلتي" : "بقا ليك " + remaining}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {books.map((book) => {
          const isPicked = picked.includes(book.id);
          const locked = complete && !isPicked;

          return (
            <button
              key={book.id}
              type="button"
              onClick={() => toggle(book.id)}
              disabled={locked}
              aria-pressed={isPicked}
              className={
                "group min-w-0 rounded-2xl border-2 p-1.5 text-right transition " +
                (isPicked
                  ? "border-orange-500 bg-orange-50"
                  : locked
                    ? "cursor-not-allowed border-gray-200 opacity-40"
                    : "border-gray-200 hover:border-orange-300")
              }
            >
              <span className="relative block aspect-3/4 w-full overflow-hidden rounded-xl">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  sizes="120px"
                  className="object-cover"
                />

                {isPicked && (
                  <span className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                    ✅
                  </span>
                )}
              </span>

              <span className="mt-1.5 block truncate text-[11px] font-semibold text-gray-700">
                {book.title}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!complete}
        className="mt-6 w-full rounded-2xl bg-orange-500 py-4 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        أضف إلى السلة — {offerPrice} د.م
      </button>

      {added && (
        <p className="mt-4 rounded-xl bg-green-100 py-3 text-center font-medium text-green-700">
          ✅ تمت الإضافة
        </p>
      )}
    </div>
  );
}

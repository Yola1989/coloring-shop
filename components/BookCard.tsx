"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type BookCardProps = {
  id: number;
  title: string;
  price: number;
  cover: string;
  /** Real age range from the database (e.g. "2-5"). */
  age?: string;
  /** Real page count from the database. */
  pages?: number;
  /** Original price, shown struck through when a promotion is active. */
  oldPrice?: number | null;
};

export default function BookCard({
  id,
  title,
  price,
  cover,
  age,
  pages,
  oldPrice,
}: BookCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart({ id, type: "book", title, price, cover });

    // Inline confirmation instead of a blocking alert() popup.
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const onPromotion = typeof oldPrice === "number" && oldPrice > price;

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl">
      <Link
        href={`/books/${id}`}
        className="relative block h-40 w-full sm:h-56 md:h-80"
      >
        <Image
          src={cover}
          alt={`غلاف كتاب التلوين ${title}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </Link>

      <div className="p-3 sm:p-5 md:p-6">
        <h3 className="break-words text-sm font-bold text-gray-900 sm:text-lg md:text-2xl">
          {title}
        </h3>

        <div className="mt-1 flex items-center gap-2 sm:mt-2">
          <p className="text-base font-bold text-orange-500 sm:text-lg md:text-xl">
            {price} DH
          </p>
          {onPromotion && (
            <p className="text-sm text-gray-400 line-through">{oldPrice} DH</p>
          )}
        </div>

        {/* Real values from the database instead of hardcoded text. */}
        <div className="mt-2 hidden space-y-1 text-sm text-gray-500 sm:block">
          {age ? <p>⭐ الأعمار {age}</p> : null}
          {typeof pages === "number" ? <p>📄 {pages} صفحة</p> : null}
        </div>

        <div className="mt-3 space-y-2 sm:mt-6 sm:space-y-3">
          <Link
            href={`/books/${id}`}
            className="block w-full rounded-xl border border-orange-500 py-2 text-center text-xs font-semibold text-orange-500 transition hover:bg-orange-50 sm:py-3 sm:text-base"
          >
            عرض التفاصيل
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-live="polite"
            className={`w-full rounded-xl py-2 text-xs font-semibold text-white transition sm:py-3 sm:text-base ${
              added
                ? "bg-green-600"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {added ? "✅ تمت الإضافة" : "أضف إلى السلة"}
          </button>
        </div>
      </div>
    </div>
  );
}

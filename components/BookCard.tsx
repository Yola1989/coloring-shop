"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

type BookCardProps = {
  id: number;
  title: string;
  price: number;
  cover: string;
};

export default function BookCard({
  id,
  title,
  price,
  cover,
}: BookCardProps) {

  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart({ id, type: "book", title, price, cover });
    alert("Book added to cart ✅");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl">

      <img
        src={cover}
        alt={title}
        className="h-40 w-full object-cover sm:h-56 md:h-80"
      />

      <div className="p-3 sm:p-5 md:p-6">

        <h3 className="text-sm font-bold text-gray-900 sm:text-lg md:text-2xl">
          {title}
        </h3>

        <p className="mt-1 text-base font-bold text-orange-500 sm:mt-2 sm:text-lg md:text-xl">
          {price} DH
        </p>

        <div className="mt-2 hidden space-y-1 text-sm text-gray-500 sm:block">
          <p>⭐ Ages 2–5</p>
          <p>📄 40 Pages</p>
        </div>

        <div className="mt-3 space-y-2 sm:mt-6 sm:space-y-3">

          <Link
            href={`/books/${id}`}
            className="block w-full rounded-xl border border-orange-500 py-2 text-center text-xs font-semibold text-orange-500 transition hover:bg-orange-50 sm:py-3 sm:text-base"
          >
            View Details
          </Link>

          <button
            onClick={handleAddToCart}
            className="w-full rounded-xl bg-orange-500 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 sm:py-3 sm:text-base"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}

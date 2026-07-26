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
    addToCart({ id, title, price, cover });
    alert("Book added to cart ✅");
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <img
        src={cover}
        alt={title}
        className="h-80 w-full object-cover"
      />

      <div className="p-6">

        <h3 className="text-2xl font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Printable PDF Coloring Book
        </p>

        <p className="mt-2 text-xl font-bold text-orange-500">
          {price} DH
        </p>

        <div className="mt-3 space-y-1 text-sm text-gray-500">
          <p>⭐ Ages 2–5</p>
          <p>📄 40 Pages</p>
        </div>

        <div className="mt-6 space-y-3">

          <Link
            href={`/books/${id}`}
            className="block w-full rounded-xl border border-orange-500 py-3 text-center font-semibold text-orange-500 transition hover:bg-orange-50"
          >
            View Details
          </Link>

          <button
            onClick={handleAddToCart}
            className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}
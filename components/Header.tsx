"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import AnnouncementBar from "./AnnouncementBar";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <div className="sticky top-0 z-50">
      <AnnouncementBar />
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            LawenBook
          </Link>

          <Link
            href="/cart"
            className="rounded-full bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600 transition"
          >
            🛒 {totalItems} Books
          </Link>
        </div>
      </header>
    </div>
  );
}

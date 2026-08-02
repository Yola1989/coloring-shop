"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import AnnouncementBar from "./AnnouncementBar";
import Logo from "./Logo";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <div className="sticky top-0 z-50">
      <AnnouncementBar />
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="shrink-0" aria-label="LawenBook">
            {/* Logo size lives here. h-16 = 64px tall, h-20 = 80px on wider
              screens. Bump both numbers together to grow the logo. */}
            <Logo priority className="h-16 w-52 sm:h-20 sm:w-64" />
          </Link>

          <Link
            href="/cart"
            className="shrink-0 whitespace-nowrap rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 sm:px-5 sm:text-base"
          >
            🛒 السلة ({totalItems})
          </Link>
        </div>
      </header>
    </div>
  );
}

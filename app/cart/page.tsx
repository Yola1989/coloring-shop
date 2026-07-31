"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <>
      <Header />

      <main dir="rtl" className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">سلة المشتريات</h1>

        {cart.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-gray-500">السلة فارغة.</p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              تصفح الكتب
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4 sm:space-y-6">
            {cart.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center gap-3 rounded-2xl border border-gray-200 p-3 sm:gap-6 sm:p-4"
              >
                <Image
                  src={item.cover}
                  alt={item.title}
                  width={80}
                  height={96}
                  className="h-20 w-16 shrink-0 rounded-lg object-cover sm:h-24 sm:w-20"
                />

                {/* min-w-0 lets long titles wrap instead of widening the row. */}
                <div className="min-w-0 flex-1">
                  <h2 className="break-words text-sm font-bold text-gray-900 sm:text-base">
                    {item.title}
                  </h2>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    {item.price} د.م
                  </p>

                  <div className="mt-2 flex items-center gap-2 sm:mt-3 sm:gap-3">
                    <button
                      type="button"
                      aria-label="إنقاص الكمية"
                      onClick={() =>
                        updateQuantity(item.id, item.type, item.quantity - 1)
                      }
                      className="h-8 w-8 shrink-0 rounded-full border border-gray-300 font-bold text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="زيادة الكمية"
                      onClick={() =>
                        updateQuantity(item.id, item.type, item.quantity + 1)
                      }
                      className="h-8 w-8 shrink-0 rounded-full border border-gray-300 font-bold text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="shrink-0 text-left">
                  <p className="whitespace-nowrap text-sm font-bold text-gray-900 sm:text-base">
                    {item.price * item.quantity} د.م
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id, item.type)}
                    className="mt-2 text-xs text-red-500 hover:underline sm:text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <span className="text-lg font-bold text-gray-900 sm:text-xl">
                المجموع
              </span>
              <span className="text-lg font-bold text-orange-500 sm:text-xl">
                {totalPrice} د.م
              </span>
            </div>

            <Link
              href="/checkout"
              className="block w-full rounded-xl bg-orange-500 py-4 text-center text-base font-semibold text-white transition hover:bg-orange-600 sm:text-lg"
            >
              متابعة الطلب
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

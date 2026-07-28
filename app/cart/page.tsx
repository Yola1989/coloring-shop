"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <>
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-gray-500">Your cart is empty.</p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {cart.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center gap-6 rounded-2xl border border-gray-200 p-4"
              >
                <img
                  src={item.cover}
                  alt={item.title}
                  className="h-24 w-20 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h2 className="font-bold text-gray-900">{item.title}</h2>
                  <p className="text-sm text-gray-500">{item.price} DH</p>

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                      className="h-8 w-8 rounded-full border border-gray-300 font-bold text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                      className="h-8 w-8 rounded-full border border-gray-300 font-bold text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {item.price * item.quantity} DH
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id, item.type)}
                    className="mt-2 text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-orange-500">
                {totalPrice} DH
              </span>
            </div>

            <Link
              href="/checkout"
              className="block w-full rounded-xl bg-orange-500 py-4 text-center text-lg font-semibold text-white transition hover:bg-orange-600"
            >
              Checkout
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

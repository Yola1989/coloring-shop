"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        phone,
        city,
        address,
        notes,
        cart: cart.map((i) => ({ id: i.id, type: i.type, quantity: i.quantity })),
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }

    const data = await res.json();
    clearCart();
    router.push(`/order-confirmed?orderNumber=${data.orderNumber}`);
  }

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-2xl px-6 py-20 text-center">
          <p className="text-gray-500">Your cart is empty.</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition"
          >
            Browse Books
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="mt-2 text-sm text-gray-500">
          Cash on Delivery — pay when your order arrives.
        </p>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
          {cart.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-center justify-between py-1 text-sm"
            >
              <span className="text-gray-700">
                {item.title} × {item.quantity}
              </span>
              <span className="font-semibold text-gray-900">
                {item.price * item.quantity} DH
              </span>
            </div>
          ))}
          <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-orange-500">{totalPrice} DH</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-3xl border border-gray-200 bg-white p-8"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Phone Number
            </label>
            <input
              required
              type="tel"
              placeholder="06 12 34 56 78"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              City
            </label>
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Full Address
            </label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Notes (optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-orange-500 py-4 text-lg font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {submitting ? "Placing order..." : `Confirm Order (COD) — ${totalPrice} DH`}
          </button>
        </form>
      </main>
    </>
  );
}

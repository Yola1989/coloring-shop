"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";

// Moroccan numbers: 05/06/07 + 8 digits, or the +212 international form.
const PHONE_RE = /^(?:\+212|0)[5-7]\d{8}$/;

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
    setError("");

    const cleanPhone = phone.replace(/[\s.\-()]/g, "");
    if (!PHONE_RE.test(cleanPhone)) {
      setError("رقم الهاتف غير صحيح. مثال: 0612345678");
      return;
    }

    if (fullName.trim().length < 3) {
      setError("المرجو إدخال الاسم الكامل.");
      return;
    }

    setSubmitting(true);

    // Any network failure must release the button, otherwise the customer
    // is stuck staring at a disabled "ordering..." state forever.
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: cleanPhone,
          city: city.trim(),
          address: address.trim(),
          notes: notes.trim(),
          cart: cart.map((i) => ({
            id: i.id,
            type: i.type,
            quantity: i.quantity,
          })),
        }),
      });

      if (!res.ok) {
        setError("تعذر إرسال الطلب. المرجو المحاولة مرة أخرى.");
        return;
      }

      const data = await res.json();

      if (!data?.orderNumber) {
        setError("تعذر إرسال الطلب. المرجو المحاولة مرة أخرى.");
        return;
      }

      clearCart();
      router.push(`/order-confirmed?orderNumber=${data.orderNumber}`);
    } catch {
      setError("تعذر الاتصال بالإنترنت. تحقق من اتصالك وحاول مجددا.");
    } finally {
      setSubmitting(false);
    }
  }

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <main dir="rtl" className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <p className="text-gray-500">السلة فارغة.</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            تصفح الكتب
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main dir="rtl" className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">إتمام الطلب</h1>
        <p className="mt-2 text-sm text-gray-500">
          الدفع عند الاستلام — تدفع منين يوصلك الطلب.
        </p>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
          {cart.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-center justify-between gap-3 py-1 text-sm"
            >
              <span className="min-w-0 break-words text-gray-700">
                {item.title} × {item.quantity}
              </span>
              <span className="shrink-0 font-semibold text-gray-900">
                {item.price * item.quantity} د.م
              </span>
            </div>
          ))}
          <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="font-bold text-gray-900">المجموع</span>
            <span className="font-bold text-orange-500">{totalPrice} د.م</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-3xl border border-gray-200 bg-white p-5 sm:p-8"
        >
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
              الاسم الكامل
            </label>
            <input
              id="fullName"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
              رقم الهاتف
            </label>
            <input
              id="phone"
              required
              type="tel"
              dir="ltr"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0612345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-right outline-none focus:border-orange-500"
            />
            <p className="mt-1 text-xs text-gray-400">مثال: 0612345678</p>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-700">
              المدينة
            </label>
            <input
              id="city"
              required
              autoComplete="address-level2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
              العنوان الكامل
            </label>
            <textarea
              id="address"
              required
              rows={3}
              autoComplete="street-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700">
              ملاحظات (اختياري)
            </label>
            <textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-orange-500 py-4 text-base font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50 sm:text-lg"
          >
            {submitting
              ? "جاري إرسال الطلب..."
              : `تأكيد الطلب (الدفع عند الاستلام) — ${totalPrice} د.م`}
          </button>
        </form>
      </main>
    </>
  );
}

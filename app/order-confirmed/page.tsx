import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";

type Props = {
  searchParams: Promise<{ orderNumber?: string }>;
};

export const metadata: Metadata = {
  title: "تم تأكيد الطلب",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmedPage({ searchParams }: Props) {
  const { orderNumber } = await searchParams;

  return (
    <>
      <Header />
      <main dir="rtl" className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="text-5xl">✅</div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          تم تأكيد طلبك
        </h1>
        <p className="mt-3 text-gray-500">
          شكرا لك! سنتصل بك قريبا لتأكيد التوصيل. الدفع عند الاستلام.
        </p>

        {orderNumber && (
          <p className="mt-6 rounded-xl bg-orange-50 px-4 py-4 text-base font-semibold text-orange-600 sm:text-lg">
            رقم الطلب: <span dir="ltr">{orderNumber}</span>
          </p>
        )}

        <p className="mt-4 text-xs text-gray-400">
          احتفظ برقم الطلب لمتابعة طلبيتك.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          مواصلة التسوق
        </Link>
      </main>
    </>
  );
}

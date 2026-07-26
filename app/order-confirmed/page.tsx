import Link from "next/link";
import Header from "@/components/Header";

type Props = {
  searchParams: Promise<{ orderNumber?: string }>;
};

export default async function OrderConfirmedPage({ searchParams }: Props) {
  const { orderNumber } = await searchParams;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Order Confirmed
        </h1>
        <p className="mt-3 text-gray-500">
          Thank you! Your order has been placed and will be paid on delivery.
        </p>

        {orderNumber && (
          <p className="mt-6 rounded-xl bg-orange-50 py-4 text-lg font-semibold text-orange-600">
            Order #{orderNumber}
          </p>
        )}

        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition"
        >
          Continue Shopping
        </Link>
      </main>
    </>
  );
}

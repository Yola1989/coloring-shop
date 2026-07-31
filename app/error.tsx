"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      dir="rtl"
      className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center"
    >
      <p className="text-7xl">⚠️</p>

      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        وقع خطأ غير متوقع
      </h1>

      <p className="mt-4 text-gray-600">
        عفواً، لم نتمكن من تحميل هذه الصفحة. حاول مرة أخرى.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-orange-600"
        >
          إعادة المحاولة
        </button>

        <Link
          href="/"
          className="rounded-xl border border-orange-500 px-8 py-4 text-lg font-semibold text-orange-500 transition hover:bg-orange-50"
        >
          الصفحة الرئيسية
        </Link>
      </div>
    </main>
  );
}

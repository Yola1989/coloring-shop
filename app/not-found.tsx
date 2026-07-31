import Link from "next/link";

export const metadata = {
  title: "الصفحة غير موجودة",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center"
    >
      <p className="text-7xl">🎨</p>

      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        الصفحة اللي كتقلب عليها ماكايناش
      </h1>

      <p className="mt-4 text-gray-600">
        يمكن أن يكون الرابط خاطئاً أو أن الكتاب تمّ حذفه.
      </p>

      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-orange-600"
      >
        الرجوع للصفحة الرئيسية
      </Link>
    </main>
  );
}

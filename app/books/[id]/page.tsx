import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import AddToCartButton from "@/components/AddToCartButton";
import PreviewGallery from "@/components/PreviewGallery";
import ProductVideo from "@/components/ProductVideo";
import { getPromotionPriceMap, getEffectivePrice } from "@/lib/pricing";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

// Per-book title/description/preview image, so every product page has its
// own entry in Google and its own preview card on WhatsApp and Facebook.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id: Number(id) } });

  if (!book) {
    return { title: "الكتاب غير موجود" };
  }

  const description = book.description.slice(0, 155);

  return {
    title: book.title,
    description,
    alternates: { canonical: `/books/${book.id}` },
    openGraph: {
      type: "article",
      title: book.title,
      description,
      images: book.cover ? [{ url: book.cover, alt: book.title }] : undefined,
    },
  };
}

export default async function BookDetails({ params }: Props) {
  const { id } = await params;

  const book = await prisma.book.findUnique({ where: { id: Number(id) } });

  if (!book) {
    notFound();
  }

  const promoMap = await getPromotionPriceMap();
  const effectivePrice = getEffectivePrice(book.id, book.price, promoMap);
  const onPromotion = effectivePrice !== book.price;

 return (
  <>
    <Header />

    <main className="mx-auto max-w-7xl px-6 py-12">
    <div className="grid gap-12 lg:grid-cols-2">

      {/* Cover */}
      <div>
        <Image
          src={book.cover}
          alt={`غلاف كتاب التلوين ${book.title}`}
          width={800}
          height={1000}
          priority
          sizes="(max-width: 1024px) 100vw, 448px"
          className="mx-auto h-auto w-full max-w-md rounded-3xl border border-gray-200 shadow-lg"
        />

        <div className="mt-6">
          <PreviewGallery images={book.preview} title={book.title} />
        </div>
      </div>

      {/* Info */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          {book.title}
        </h1>

        <div className="mt-4 flex items-center gap-3">
          <p className="text-lg font-bold text-orange-500">
            {effectivePrice} DH
          </p>
          {onPromotion && (
            <p className="text-base text-gray-400 line-through">
              {book.price} DH
            </p>
          )}
        </div>

        <div className="mt-6 space-y-2 text-gray-700">
          <p>⭐ الأعمار {book.age}</p>
          <p>📄 {book.pages} صفحة</p>
        </div>

        <p className="mt-8 leading-8 text-gray-800">
          {book.description}
        </p>

        <div className="mt-10">
          <AddToCartButton
            id={book.id}
            title={book.title}
            price={effectivePrice}
            cover={book.cover}
          />
        </div>

        <ProductVideo videoUrl={book.videoUrl} />
      </div>

    </div>
    </main>
  </>
);
}

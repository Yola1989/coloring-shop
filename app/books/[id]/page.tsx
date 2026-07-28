import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
  <main className="mx-auto max-w-7xl px-6 py-12">
    <div className="grid gap-12 lg:grid-cols-2">

      {/* Cover */}
      <div>
        <img
          src={book.cover}
          alt={book.title}
          className="mx-auto w-full max-w-md rounded-3xl border border-gray-200 shadow-lg"
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
          <p>⭐ Ages {book.age}</p>
          <p>📄 {book.pages} Pages</p>
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
);
}

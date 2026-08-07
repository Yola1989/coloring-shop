import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import AddToCartButton from "@/components/AddToCartButton";
import OfferBookPicker from "@/components/OfferBookPicker";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function OfferDetails({ params }: Props) {
  const { id } = await params;

  const offer = await prisma.specialOffer.findUnique({
    where: { id: Number(id) },
  });

  if (!offer || !offer.enabled) {
    notFound();
  }

  // Only a "pick your own books" offer needs the catalogue, so a plain
  // bundle keeps loading exactly as fast as it did before.
  const letsCustomerPick = offer.pickEnabled && offer.pickCount > 0;

  const books = letsCustomerPick
    ? await prisma.book.findMany({
        orderBy: [{ position: "asc" }, { id: "asc" }],
        select: { id: true, title: true, cover: true },
      })
    : [];

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
            <Image
              src={offer.imageUrl}
              alt={offer.title}
              width={800}
              height={800}
              priority
              sizes="(max-width: 1024px) 100vw, 448px"
              className="mx-auto h-auto w-full max-w-md rounded-3xl border border-gray-200 shadow-lg"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold break-words text-gray-900 sm:text-3xl lg:text-4xl">
              {offer.title}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <p className="text-lg font-bold text-orange-500">
                {offer.price} DH
              </p>
              {offer.oldPrice && (
                <p className="text-base text-gray-400 line-through">
                  {offer.oldPrice} DH
                </p>
              )}
            </div>

            <p className="mt-8 leading-8 whitespace-pre-line text-gray-800">
              {offer.description}
            </p>

            <div className="mt-10">
              {letsCustomerPick ? (
                <OfferBookPicker
                  offerId={offer.id}
                  offerTitle={offer.title}
                  offerPrice={offer.price}
                  offerImage={offer.imageUrl}
                  pickCount={offer.pickCount}
                  books={books}
                />
              ) : (
                <AddToCartButton
                  id={offer.id}
                  type="offer"
                  title={offer.title}
                  price={offer.price}
                  cover={offer.imageUrl}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

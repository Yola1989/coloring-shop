import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import AddToCartButton from "@/components/AddToCartButton";

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

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
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

          <div>
            <h1 className="text-4xl font-bold text-gray-900">
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

            <p className="mt-8 leading-8 text-gray-800">
              {offer.description}
            </p>

            <div className="mt-10">
              <AddToCartButton
                id={offer.id}
                type="offer"
                title={offer.title}
                price={offer.price}
                cover={offer.imageUrl}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

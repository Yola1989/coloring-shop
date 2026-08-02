import Image from "next/image";
import Link from "next/link";

type SpecialOffer = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  oldPrice: number | null;
};

type SpecialOffersSectionProps = {
  offers: SpecialOffer[];
};

// Independent from the Books Promotion section — for bundles and future
// non-book products. Hidden entirely when there are no enabled offers.
export default function SpecialOffersSection({
  offers,
}: SpecialOffersSectionProps) {
  if (offers.length === 0) return null;

  return (
    <section
      id="special-offers"
      className="mt-16 scroll-mt-28 rounded-3xl border-2 border-gray-900/10 bg-gray-50 px-5 py-10 md:px-12"
    >
      <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl md:text-left">
        عروض خاصة
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-56 w-full sm:h-72">
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="p-5">
              <p className="text-xl font-bold text-gray-900">
                {offer.title}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm text-gray-500">
                {offer.description}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-lg font-bold text-orange-500">
                  {offer.price} DH
                </p>
                {offer.oldPrice && (
                  <p className="text-sm text-gray-400 line-through">
                    {offer.oldPrice} DH
                  </p>
                )}
              </div>

              <Link
                href={`/offers/${offer.id}`}
                className="mt-4 block w-full rounded-xl border border-orange-500 py-3 text-center font-semibold text-orange-500 transition hover:bg-orange-50"
              >
                عرض التفاصيل
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteOfferButton from "./DeleteOfferButton";

export const dynamic = "force-dynamic";

export default async function AdminOffersPage() {
  const offers = await prisma.specialOffer.findMany({
    orderBy: { position: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Special Offers</h1>
        <Link
          href="/admin/offers/new"
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 transition"
        >
          + Add Offer
        </Link>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Bundles and future products — independent from Books Promotion.
      </p>

      {offers.length === 0 ? (
        <p className="mt-10 text-gray-500">
          No special offers yet. Add your first one.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4"
            >
              <img
                src={offer.imageUrl}
                alt={offer.title}
                className="h-20 w-20 rounded-lg object-cover"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-900">{offer.title}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      offer.enabled
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {offer.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {offer.price} DH
                  {offer.oldPrice ? ` (was ${offer.oldPrice} DH)` : ""}
                </p>
              </div>

              <Link
                href={`/admin/offers/${offer.id}/edit`}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Edit
              </Link>

              <DeleteOfferButton id={offer.id} title={offer.title} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

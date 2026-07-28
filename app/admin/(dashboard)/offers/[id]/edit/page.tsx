import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OfferForm from "../../OfferForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditOfferPage({ params }: Props) {
  const { id } = await params;
  const offer = await prisma.specialOffer.findUnique({
    where: { id: Number(id) },
  });

  if (!offer) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Edit Special Offer</h1>
      <OfferForm initial={offer} />
    </div>
  );
}

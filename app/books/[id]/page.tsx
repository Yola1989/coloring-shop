import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

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

        <div className="mt-6 grid grid-cols-3 gap-4">
          {book.preview.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Preview ${index + 1}`}
              className="aspect-[3/4] rounded-xl border border-gray-200 object-cover"
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          {book.title}
        </h1>

        <p className="mt-4 text-lg text-orange-500 font-bold">
          {book.price} DH
        </p>

        <div className="mt-6 space-y-2 text-gray-600">
          <p>⭐ Ages {book.age}</p>
          <p>📄 {book.pages} Pages</p>
        </div>

        <p className="mt-8 leading-8 text-gray-700">
          {book.description}
        </p>

        <div className="mt-10">
          <AddToCartButton
            id={book.id}
            title={book.title}
            price={book.price}
            cover={book.cover}
          />
        </div>
      </div>

    </div>
  </main>
);
}
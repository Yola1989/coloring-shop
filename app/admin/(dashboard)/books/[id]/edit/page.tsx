import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookForm from "../../BookForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditBookPage({ params }: Props) {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id: Number(id) } });

  if (!book) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Edit Book</h1>
      <BookForm initial={book} />
    </div>
  );
}

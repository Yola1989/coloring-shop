import { prisma } from "@/lib/prisma";
import PromotionForm from "./PromotionForm";

export const dynamic = "force-dynamic";

export default async function AdminPromotionPage() {
  let promotion = await prisma.promotion.findFirst();
  if (!promotion) {
    promotion = await prisma.promotion.create({ data: {} });
  }

  const books = await prisma.book.findMany({ orderBy: { id: "asc" } });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Books Promotion</h1>
      <p className="mt-2 text-sm text-gray-500">
        Feature up to two books in a highlighted section on the homepage.
      </p>

      <PromotionForm
        initial={{
          enabled: promotion.enabled,
          title: promotion.title,
          description: promotion.description,
          book1Id: promotion.book1Id,
          book1Price: promotion.book1Price,
          book2Id: promotion.book2Id,
          book2Price: promotion.book2Price,
        }}
        books={books.map((b) => ({ id: b.id, title: b.title }))}
      />
    </div>
  );
}

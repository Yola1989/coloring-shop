import Header from "@/components/Header";
import BookCard from "@/components/BookCard";
import { prisma } from "@/lib/prisma";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const books = await prisma.book.findMany({ orderBy: { id: "asc" } });
  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="text-center">
          <h2 className="text-5xl font-bold">
            Coloring Books for Kids
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Printable coloring books for children aged 2–5.
          </p>

          <button className="mt-8 rounded-xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-orange-600">
            Browse Books
          </button>
        </section>

        <section className="mt-20">
          <h2 className="mb-8 text-3xl font-bold">
            Featured Books
          </h2>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                price={book.price}
                cover={book.cover}
              />
            ))}
          </div>
        </section>
            </main>

      <Footer />
    </>
  );
}
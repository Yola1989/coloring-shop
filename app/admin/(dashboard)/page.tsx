import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteBookButton from "./DeleteBookButton";

export const dynamic = "force-dynamic";

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({ orderBy: { id: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Books</h1>
        <Link
          href="/admin/books/new"
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 transition"
        >
          + Add Book
        </Link>
      </div>

      {books.length === 0 ? (
        <p className="mt-10 text-gray-500">No books yet. Add your first one.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4"
            >
              <img
                src={book.cover}
                alt={book.title}
                className="h-20 w-16 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h2 className="font-bold text-gray-900">{book.title}</h2>
                <p className="text-sm text-gray-500">
                  {book.price} DH · {book.pages} pages · Ages {book.age}
                </p>
              </div>

              <Link
                href={`/admin/books/${book.id}/edit`}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Edit
              </Link>

              <DeleteBookButton id={book.id} title={book.title} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

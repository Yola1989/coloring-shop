import Link from "next/link";

type PromotionBook = {
  id: number;
  title: string;
  price: number;
  cover: string;
  displayPrice: number;
};

type PromotionSectionProps = {
  title: string;
  description: string;
  books: PromotionBook[];
};

// Hidden entirely on the homepage unless a promotion is enabled and has
// at least one book attached — kept simple/self-contained on purpose.
export default function PromotionSection({
  title,
  description,
  books,
}: PromotionSectionProps) {
  if (books.length === 0) return null;

  return (
    <section className="mt-16 rounded-3xl border-2 border-orange-200 bg-orange-50 px-6 py-10 md:px-12">
      <div className="text-center md:text-left">
        {title && (
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        )}
        {description && (
          <p className="mt-2 text-gray-600">{description}</p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {books.map((book) => (
          <div
            key={book.id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <img
              src={book.cover}
              alt={book.title}
              className="h-56 w-full object-cover sm:h-72"
            />

            <div className="p-5">
              <p className="text-xl font-bold text-gray-900">
                {book.title}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-lg font-bold text-orange-500">
                  {book.displayPrice} DH
                </p>
                {book.displayPrice !== book.price && (
                  <p className="text-sm text-gray-400 line-through">
                    {book.price} DH
                  </p>
                )}
              </div>

              <Link
                href={`/books/${book.id}`}
                className="mt-4 block w-full rounded-xl border border-orange-500 py-3 text-center font-semibold text-orange-500 transition hover:bg-orange-50"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

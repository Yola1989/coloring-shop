import Header from "@/components/Header";
import BookCard from "@/components/BookCard";
import HeroIllustration from "@/components/HeroIllustration";
import PromotionSection from "@/components/PromotionSection";
import SpecialOffersSection from "@/components/SpecialOffersSection";
import { prisma } from "@/lib/prisma";
import { getPromotionPriceMap, getEffectivePrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function Home() {
  const books = await prisma.book.findMany({ orderBy: { id: "asc" } });

  const promoMap = await getPromotionPriceMap();

  const promotion = await prisma.promotion.findFirst();
  const promotionBookIds = [promotion?.book1Id, promotion?.book2Id].filter(
    (id): id is number => Boolean(id)
  );
  const promotionBooksRaw =
    promotion?.enabled && promotionBookIds.length > 0
      ? await prisma.book.findMany({ where: { id: { in: promotionBookIds } } })
      : [];

  const promotionBooks = promotionBooksRaw.map((book) => ({
    ...book,
    displayPrice: getEffectivePrice(book.id, book.price, promoMap),
  }));

  const specialOffers = await prisma.specialOffer.findMany({
    where: { enabled: true },
    orderBy: { position: "asc" },
  });

  const bannerOffer = specialOffers[0];

  return (
    <>
      <Header />

      {bannerOffer && (
        <a
          href="#special-offers"
          className="block bg-gray-900 px-4 py-2 text-center text-xs font-medium text-white transition hover:bg-gray-800 sm:text-sm"
        >
          🎁 Special Offer: Save on {bannerOffer.title} → Shop Now
        </a>
      )}

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid items-center gap-10 rounded-3xl bg-gradient-to-br from-orange-50 via-white to-sky-50 px-6 py-10 md:grid-cols-2 md:px-12 md:py-16">
          <div className="text-center md:text-right" dir="rtl">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          
              لوّن، استمتع، أطلق إبداعك
            </h2>

            <p className="mt-4 text-lg text-gray-600">
              كل لون يحكي حكاية... وكل صفحة بداية لإبداع جديد. اكتشف عالماً
              من كتب التلوين المصممة لتناسب جميع الأعمار، حيث يلتقي الإبداع
              بالمتعة في كل صفحة.
            </p>

            <a
              href="#featured-books"
              className="mt-8 inline-block rounded-xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-orange-600"
            >
              Browse Books
            </a>
          </div>

          <div className="flex justify-center">
            <HeroIllustration />
          </div>
        </section>

        <SpecialOffersSection offers={specialOffers} />

        {promotion?.enabled && (
          <PromotionSection
            title={promotion.title}
            description={promotion.description}
            books={promotionBooks}
          />
        )}

        <section id="featured-books" className="mt-20 scroll-mt-28">
          <h2 className="mb-8 text-3xl font-bold">
            Featured Books
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                price={getEffectivePrice(book.id, book.price, promoMap)}
                cover={book.cover}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

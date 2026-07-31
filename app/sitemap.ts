import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lawenbook.online"
).replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [books, offers] = await Promise.all([
    prisma.book.findMany({ select: { id: true, updatedAt: true } }),
    prisma.specialOffer.findMany({
      where: { enabled: true },
      select: { id: true, updatedAt: true },
    }),
  ]);

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...books.map((book) => ({
      url: `${SITE_URL}/books/${book.id}`,
      lastModified: book.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...offers.map((offer) => ({
      url: `${SITE_URL}/offers/${offer.id}`,
      lastModified: offer.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}

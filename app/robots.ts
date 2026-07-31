import type { MetadataRoute } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lawenbook.online"
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private / non-indexable areas.
        disallow: ["/admin", "/api/", "/cart", "/checkout", "/order-confirmed"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

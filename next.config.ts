import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js only optimises remote images whose hostname is listed here.
    // Anything else throws "hostname is not configured under images".
    remotePatterns: [
      // Cloudflare R2 public bucket (real product images).
      { protocol: "https", hostname: "pub-9b3678fddf8742c68c9ecd54cbc648da.r2.dev", pathname: "/**" },
      { protocol: "https", hostname: "**.r2.dev", pathname: "/**" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com", pathname: "/**" },

      // Own domain, in case a CDN subdomain is added later.
      { protocol: "https", hostname: "**.lawenbook.online", pathname: "/**" },

      // Placeholder services used by test/demo rows still in the database.
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "via.placeholder.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

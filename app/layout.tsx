import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { prisma } from "@/lib/prisma";
import SiteChrome from "@/components/SiteChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lawenbook.online"
).replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "LawenBook — كتب التلوين للأطفال والكبار في المغرب",
    template: "%s | LawenBook",
  },
  description:
    "كتب تلوين بجودة عالية للأطفال والكبار — من رسوم بسيطة للصغار إلى تصاميم دقيقة للاسترخاء. التوصيل مجاني لجميع مدن المغرب والدفع عند الاستلام.",
  keywords: [
    "كتب التلوين",
    "كتب تلوين للكبار",
    "كتب تلوين للأطفال",
    "تلوين للراشدين",
    "تلوين",
    "المغرب",
    "LawenBook",
    "coloring books morocco",
    "adult coloring books",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_MA",
    url: SITE_URL,
    siteName: "LawenBook",
    title: "LawenBook — كتب التلوين للأطفال والكبار",
    description:
      "التوصيل مجاني لجميع مدن المغرب | الدفع عند الاستلام",
  },
  twitter: {
    card: "summary_large_image",
    title: "LawenBook — كتب التلوين للأطفال والكبار",
    description: "التوصيل مجاني لجميع مدن المغرب | الدفع عند الاستلام",
  },
  robots: { index: true, follow: true },
};

// The layout reads site settings from the database on every request,
// so it must never be statically prerendered at build time.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.settings.findFirst();

  return (
    <html
      lang="ar"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <SiteChrome phoneNumber={settings?.whatsappNumber ?? ""} />
        </CartProvider>
      </body>
    </html>
  );
}

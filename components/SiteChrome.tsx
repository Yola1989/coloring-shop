"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

type SiteChromeProps = {
  phoneNumber: string;
};

// Renders the customer-facing footer + floating WhatsApp button on every
// page except the admin dashboard, without needing to touch each page.
export default function SiteChrome({ phoneNumber }: SiteChromeProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <Footer phoneNumber={phoneNumber} />
      <WhatsAppButton phoneNumber={phoneNumber} />
    </>
  );
}

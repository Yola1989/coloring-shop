"use client";

import { useEffect, useState } from "react";
import { useUpsellData } from "@/lib/upsellClient";

const FREE_SHIPPING = "🚚 التوصيل مجاني لجميع مدن المغرب | الدفع عند الاستلام";

// Every visitor sees this bar, so it is the one place the second-book offer
// is guaranteed to be noticed. The offer line only joins the rotation while
// the offer is actually switched on in Settings, so the bar can never
// advertise something the checkout will not honour.
export default function AnnouncementBar() {
  const upsell = useUpsellData();
  const [index, setIndex] = useState(0);

  const offerMessage =
    upsell?.enabled && upsell.price > 0
      ? "🎁 الكتاب الثاني بـ " + upsell.price + " د.م فقط"
      : null;

  const messages = offerMessage ? [FREE_SHIPPING, offerMessage] : [FREE_SHIPPING];

  useEffect(() => {
    if (messages.length < 2) {
      setIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [messages.length]);

  // Guard the index in case the offer is switched off between renders.
  const message = messages[Math.min(index, messages.length - 1)];

  return (
    <div className="bg-orange-500 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
      {message}
    </div>
  );
}

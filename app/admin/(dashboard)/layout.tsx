import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LogoutButton from "./LogoutButton";
import Logo from "@/components/Logo";
import type { Metadata, Viewport } from "next";

/*
  Only the admin area advertises an installable app. The storefront
  deliberately has no manifest, so customers are never prompted to
  install a dashboard they cannot open.
*/
export const metadata: Metadata = {
  title: "LawenBook Admin",
  manifest: "/admin.webmanifest",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
};

const NAV_ITEMS = [
  { href: "/admin", label: "Books", icon: "📚" },
  { href: "/admin/orders", label: "Orders", icon: "🧾" },
  { href: "/admin/promotion", label: "Books Promotion", icon: "🏷️" },
  { href: "/admin/offers", label: "Special Offers", icon: "🎁" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();

  if (!authed) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Vertical sidebar, pinned to the left on tablet and desktop. */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-gray-200 bg-white md:flex">
        <div className="border-b border-gray-200 px-5 py-5">
          <Link href="/admin" className="block" aria-label="LawenBook">
            <Logo className="h-12 w-44" />
          </Link>
          <p className="mt-0.5 text-xs text-gray-400">Admin Panel</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
            >
              <span aria-hidden="true" className="text-base">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <LogoutButton />
        </div>
      </aside>

      {/* min-w-0 stops wide tables from pushing the whole page sideways. */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Compact top bar shown only on phones. */}
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white md:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Link href="/admin" className="shrink-0" aria-label="LawenBook">
              <Logo className="h-10 w-36" />
            </Link>
            <LogoutButton />
          </div>

          <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="min-w-0 flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}

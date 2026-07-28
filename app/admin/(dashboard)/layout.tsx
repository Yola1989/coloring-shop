import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

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
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-xl font-bold text-orange-500">
              Coloring Shop — Admin
            </Link>
            <nav className="flex items-center gap-4 text-sm font-semibold text-gray-600">
              <Link href="/admin" className="hover:text-orange-500">
                Books
              </Link>
              <Link href="/admin/orders" className="hover:text-orange-500">
                Orders
              </Link>
              <Link href="/admin/promotion" className="hover:text-orange-500">
                Books Promotion
              </Link>
              <Link href="/admin/offers" className="hover:text-orange-500">
                Special Offers
              </Link>
              <Link href="/admin/settings" className="hover:text-orange-500">
                Settings
              </Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}

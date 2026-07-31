import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Must match COOKIE_NAME in lib/auth.ts.
const COOKIE_NAME = "admin_session";

/*
  Route-level gate for the admin area. This runs before any admin page is
  rendered, so an unauthenticated visitor is redirected instead of briefly
  loading dashboard code. The real cryptographic check still happens in
  lib/auth.ts -> isAuthenticated(); this is a cheap first line of defence.
*/
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page itself must stay reachable.
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const session = req.cookies.get(COOKIE_NAME)?.value;

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

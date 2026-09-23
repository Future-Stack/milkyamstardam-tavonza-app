import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE } from "./app/lib/constants";

/**
 * Optimistic auth gate. Next.js 16 renamed `middleware` to `proxy`; the runtime
 * is Node.js and is not configurable.
 *
 * This only checks that a session cookie is *present* — a cookie proves nothing
 * about validity or role. The real check is `requireSuperAdmin()` in the DAL,
 * which every protected page and mutating action goes through.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthenticated = request.cookies.has(SESSION_COOKIE);

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/forgot-password");

  // Let static files, api routes, and next internals pass through
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Not signed in and asking for an admin route -> login
  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // We no longer redirect authenticated users away from /login,
  // because if their session is stale, they would get stuck in an infinite loop
  // between the layout redirecting to /login and proxy redirecting to /.

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

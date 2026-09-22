import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Read the mock auth token (simulating session state)
  const isAuthenticated = request.cookies.has('admin-session');
  
  // Define auth routes (login, forgot-password, reset-password)
  const isAuthRoute = pathname.startsWith('/login') || 
                      pathname.startsWith('/forgot-password') || 
                      pathname.startsWith('/reset-password');
                      
  // Let static files, api routes, and next internals pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // If user is NOT logged in and tries to access an admin route, redirect to login
  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user IS logged in and tries to access login/auth route, redirect to home
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

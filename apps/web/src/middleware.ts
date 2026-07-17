import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/dashboard', '/profile', '/residency', '/form-8843', '/treaty', '/tax'];
const PUBLIC    = ['/login', '/register', '/forgot-password', '/'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Check for token in cookie (set by the API) or the header if SSR
  const token = req.cookies.get('access_token')?.value;

  // For client-rendered pages, localStorage cannot be read server-side.
  // We use a cookie copy set by the login page. If absent, redirect.
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/residency/:path*', '/form-8843/:path*', '/treaty/:path*', '/tax/:path*'],
};

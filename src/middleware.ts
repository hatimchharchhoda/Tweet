import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: [
    '/',
    '/signin',
    '/signup',
    '/Home',
    '/Trending',
    '/MyTweet',
    '/Profile',
    '/News',
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const isAuthPage = url.pathname === '/signin' || url.pathname === '/signup';
  const isProtectedPage = ['/Home', '/Trending', '/MyTweet', '/Profile', '/News'].some(path =>
    url.pathname.startsWith(path)
  );
  const isLandingPage = url.pathname === '/';

  // Redirect authenticated user away from /, /signin, /signup to /Home
  if (token && (isAuthPage || isLandingPage)) {
    return NextResponse.redirect(new URL('/Home', request.url));
  }

  // Redirect unauthenticated user trying to access protected routes to /signin
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Allow access to landing page (/) if not authenticated
  // Allow access to signin/signup if not authenticated
  return NextResponse.next();
}
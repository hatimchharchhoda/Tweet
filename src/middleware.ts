import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
      '/signin', 
      '/signup',
      '/Trending', 
      '/Home', 
      '/MyTweet',
      '/Profile',
    ],
  };
  
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (!token && 
    (url.pathname.startsWith('/Trending') ||
      url.pathname.startsWith('/Home') ||
      url.pathname.startsWith('/MyTweet') || 
      url.pathname.startsWith('/Profile')) ){
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  if (
    token &&
    (url.pathname.startsWith('/signin') ||
      url.pathname.startsWith('/signup'))
  ) {
    return NextResponse.redirect(new URL('/Home', request.url));
  }

  return NextResponse.next();
}
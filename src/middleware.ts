import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
      '/signin', 
      '/signup',
      '/trending', 
      '/home', 
      '/MyTweet',
      '/profile'
    ],
  };
  
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (!token && 
    (url.pathname.startsWith('/trending') ||
      url.pathname.startsWith('/home') ||
      url.pathname.startsWith('/MyTweet') || 
      url.pathname.startsWith('/profile')) ){
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  if (
    token &&
    (url.pathname.startsWith('/signin') ||
      url.pathname.startsWith('/signup'))
  ) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}
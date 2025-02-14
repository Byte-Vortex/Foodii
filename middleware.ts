import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.delete({ name, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.delete({ name, ...options });
        },
      },
    }
  );

  // Get the user's session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect unauthenticated users to the login page
  if (!session) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname); // Store the original route
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/profile',                // Protect /dashboard
    '/orders/',
    '/orders/:path*'         // Protect all subpaths of /dashboard
  ],
};

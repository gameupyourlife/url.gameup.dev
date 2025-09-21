import { createServerClient } from '@/lib/supabase'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = await createServerClient()

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not /auth
  // redirect the user to /auth
  if (!session && !request.nextUrl.pathname.startsWith('/auth') && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // If user is signed in and the current path is /auth
  // redirect the user to /dashboard
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/redirect (public redirect endpoint)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/redirect).*)',
  ],
}
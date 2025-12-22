import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Bypass middleware for API routes
  if (path.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Define public paths that don't require authentication
  const publicPaths = [
    '/',
    '/auth',
    '/explore',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
  ]

  // Allow public paths and API routes
  const isPublicPath = publicPaths.some(p => path === p || path.startsWith(p + '/'))

  // Check auth via cookies set on login (fallback to legacy headers if present)
  const tokenCookie = request.cookies.get('qouta_token')?.value
  const roleCookie = request.cookies.get('qouta_role')?.value
  const headerAuth = request.headers.get('x-has-auth') === 'true'
  const isAuthenticated = Boolean(tokenCookie) || headerAuth

  // For quiz flow, allow guests to participate
  const isQuizFlow = path.startsWith('/quiz')

  // Redirect authenticated users from landing/auth pages to dashboard
  if (isAuthenticated && (path === '/' || path === '/auth')) {
    const userRole = roleCookie || request.headers.get('x-user-role') || 'student'

    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    } else if (userRole === 'teacher') {
      return NextResponse.redirect(new URL('/teacher', request.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect unauthenticated users from protected paths to auth page
  // Exception: allow quiz flow for guests
  if (!isAuthenticated && !isPublicPath && !isQuizFlow && !path.startsWith('/stories')) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /auth)
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || 
                       path === '/auth' || 
                       path.startsWith('/stories') ||
                       path === '/privacy' ||
                       path === '/terms' ||
                       path === '/contact'

  // Define auth paths that logged-in users shouldn't access
  const isAuthPath = path === '/auth' || path === '/login' || path === '/signup'

  // Get token from cookies (you'll need to set this on login)
  const token = request.cookies.get('qouta_token')?.value || ''

  // Check localStorage fallback via header (set by client)
  const hasLocalStorage = request.headers.get('x-has-auth') === 'true'

  const isAuthenticated = !!token || hasLocalStorage

  // Redirect authenticated users from landing/auth pages to dashboard
  if (isAuthenticated && (path === '/' || isAuthPath)) {
    // Check user role from cookie to redirect appropriately
    const userRole = request.cookies.get('qouta_role')?.value || 'student'
    
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    } else if (userRole === 'teacher') {
      return NextResponse.redirect(new URL('/teacher', request.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect unauthenticated users from protected paths to auth page
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}

// Configure which routes middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
}
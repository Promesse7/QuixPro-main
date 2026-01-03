import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only handle redirects for the landing page and auth page.
  if (pathname !== "/" && pathname !== "/auth") {
    return NextResponse.next()
  }

  const token = request.cookies.get("qouta_token")?.value
  const role = request.cookies.get("qouta_role")?.value

  if (!token) {
    return NextResponse.next()
  }

  const redirectPath = role === "admin" ? "/admin" : role === "teacher" ? "/teacher" : "/dashboard"
  return NextResponse.redirect(new URL(redirectPath, request.url))
}

export const config = {
  matcher: ["/", "/auth"],
}

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(req: NextRequest) {
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value

  const isLoggedIn = !!sessionToken
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isOnAuth =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup")
  const isOnUserArea = req.nextUrl.pathname.startsWith("/eu")

  // Protect Admin
  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  // Protect User Area
  if (isOnUserArea && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  // Redirect if already logged in
  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/signup", "/eu/:path*"],
}


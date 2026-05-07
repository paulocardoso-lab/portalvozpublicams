import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isOnAuth =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup")

  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (isOnAdmin && isLoggedIn) {
    const userRole = (req.auth?.user as { role?: string })?.role
    const allowedRoles = [
      "SUPER_ADMIN",
      "EDITOR_CHIEF", 
      "SECTION_EDITOR",
      "REPORTER",
      "COLUMNIST",
      "MODERATOR",
      "FINANCE",
    ]
    if (!userRole || !allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/", req.nextUrl))
    }
  }

  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/login", "/signup", "/me/:path*"],
}

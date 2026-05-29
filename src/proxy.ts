import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import authConfig from "./auth.config.edge"

const { auth } = NextAuth(authConfig)

type SessionUserWithRole = {
  role?: string | null
}

type RedirectRequest = {
  headers: Headers
  nextUrl: URL
}

function redirectTo(path: string, req: RedirectRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host")
  const proto = req.headers.get("x-forwarded-proto") || req.nextUrl.protocol.replace(":", "")
  const origin = host ? `${proto}://${host}` : req.nextUrl.origin

  return NextResponse.redirect(new URL(path, origin))
}

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const userRole = (req.auth?.user as SessionUserWithRole | undefined)?.role || "READER"
  const { nextUrl } = req

  const isOnAdmin = nextUrl.pathname.startsWith("/admin")
  const isOnAuth = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup")
  const isOnUserArea = nextUrl.pathname.startsWith("/eu")

  if (isOnAdmin) {
    if (!isLoggedIn) {
      return redirectTo("/login", req)
    }

    if (userRole === "READER") {
      return redirectTo("/", req)
    }
  }

  if (isOnUserArea && !isLoggedIn) {
    return redirectTo("/login", req)
  }

  if (isOnAuth && isLoggedIn) {
    const redirectUrl = userRole === "READER" ? "/" : "/admin"
    return redirectTo(redirectUrl, req)
  }
})

export const config = {
  matcher: ["/admin/:path*", "/login", "/signup", "/eu/:path*"],
}

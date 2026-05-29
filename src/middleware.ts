import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import authConfig from "./auth.config.edge"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const userRole = (req.auth?.user as any)?.role || "READER"
  const { nextUrl } = req
  
  const isOnAdmin = nextUrl.pathname.startsWith("/admin")
  const isOnAuth = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup")
  const isOnUserArea = nextUrl.pathname.startsWith("/eu")

  // Protect Admin: Only roles other than READER can access
  if (isOnAdmin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    
    if (userRole === "READER") {
      // Se for apenas leitor, não entra no admin
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  // Protect User Area: Any logged in user
  if (isOnUserArea && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  if (isOnAuth && isLoggedIn) {
    // Se logado, redireciona para o admin (se tiver papel) ou home
    const redirectUrl = userRole === "READER" ? "/" : "/admin"
    return NextResponse.redirect(new URL(redirectUrl, nextUrl))
  }
})

export const config = {
  matcher: ["/admin/:path*", "/login", "/signup", "/eu/:path*"],
}


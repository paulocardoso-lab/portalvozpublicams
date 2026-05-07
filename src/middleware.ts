import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

// IMPORTANT: Do NOT import { auth } from "@/auth" here.
// It will pull in Prisma and break the Edge Function size limit on Vercel.
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isOnAuth =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup")

  // Se estiver tentando acessar admin e não estiver logado, manda pro login
  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  // Se estiver logado e tentar ir pro login/signup, manda pra admin
  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/login", "/signup", "/me/:path*"],
}

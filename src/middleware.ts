import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
  const isOnAuth = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup");

  // Se estiver tentando acessar admin e não estiver logado, manda pro login
  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Se estiver no admin, verifica o papel (role)
  if (isOnAdmin && isLoggedIn) {
    const user = req.auth?.user as { role?: string } | undefined;
    const userRole = user?.role;
    const allowedRoles = ["SUPER_ADMIN", "EDITOR_CHIEF", "SECTION_EDITOR", "REPORTER", "COLUMNIST", "MODERATOR", "FINANCE"];
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Se for apenas um READER tentando entrar no admin, manda pra home
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  // Se estiver logado e tentar ir pro login/signup, manda pra home ou admin
  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
})

export const config = {
  matcher: ["/admin/:path*", "/login", "/signup", "/me/:path*"],
}

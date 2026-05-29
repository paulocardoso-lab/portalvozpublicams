import type { NextAuthConfig } from "next-auth"

// Config leve para o middleware (Edge runtime) — sem Prisma, pg ou bcryptjs.
// O authorize real vive em auth.config.ts e só é carregado nas API routes (Node.js).
export default {
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "READER";
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig

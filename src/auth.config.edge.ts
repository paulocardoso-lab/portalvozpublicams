import type { NextAuthConfig } from "next-auth"

type AuthUserFields = {
  id?: string;
  role?: string | null;
};

// Config leve para o middleware (Edge runtime) — sem Prisma, pg ou bcryptjs.
// O authorize real vive em auth.config.ts e só é carregado nas API routes (Node.js).
export default {
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as AuthUserFields).role || "READER";
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const user = session.user as typeof session.user & AuthUserFields;
        user.role = typeof token.role === "string" ? token.role : null;
        if (typeof token.id === "string") user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig

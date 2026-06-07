import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { rateLimitAction } from "@/lib/rate-limit"

type AuthUserFields = {
  id?: string;
  role?: string | null;
};

export default {
  providers: [
    // Google desabilitado temporariamente
    // Google,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const limit = await rateLimitAction({ key: "credentials-login", limit: 10, windowMs: 10 * 60 * 1000 });
        if (limit.limited) return null;

        if (!credentials?.email || !credentials?.password) return null;

        // Dynamic import to avoid edge runtime issues
        const { default: prisma } = await import("@/lib/prisma");
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash || user.status !== "ACTIVE") return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar ?? null,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as AuthUserFields).role || null;
        token.id = user.id;
      }
      // Busca role do banco sempre que não estiver no token (magic link não retorna role no user object)
      if (!token.role && token.email) {
        const { default: prisma } = await import("@/lib/prisma");
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, status: true },
        });
        if (dbUser?.status === "ACTIVE") {
          token.role = dbUser.role;
          token.id = dbUser.id;
        }
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
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig

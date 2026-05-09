import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
// O provedor Resend foi movido para auth.ts porque requer o PrismaAdapter (que não roda no Edge/Middleware)

export default {
  providers: [
    Google,
  ],
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
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig

import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Apple from "next-auth/providers/apple"
import Resend from "next-auth/providers/resend"

export default {
  providers: [
    Google,
    Apple,
    Resend({
      from: "no-reply@vozpublicams.com.br",
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig

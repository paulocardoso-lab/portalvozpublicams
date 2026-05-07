import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"

export default {
  providers: [
    // Deixando o Google sem opções para que ele use automaticamente 
    // AUTH_GOOGLE_ID e AUTH_GOOGLE_SECRET do ambiente (Vercel)
    Google,
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "no-reply@vozpublicams.com.br",
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user && user) {
        (session.user as { role?: string }).role = (user as { role?: string }).role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redireciona erros para a página de login
  },
  debug: process.env.NODE_ENV === "development", // Habilita debug em desenvolvimento
} satisfies NextAuthConfig

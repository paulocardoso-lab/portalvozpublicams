import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"

import { magicLinkTemplate } from "./lib/email-templates"
import { Resend as ResendClient } from "resend"

const resendClient = new ResendClient(process.env.RESEND_API_KEY)

export default {
  providers: [
    Google,
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "Voz Pública MS <onboarding@resend.dev>",
      async sendVerificationRequest({ identifier, url }) {
        await resendClient.emails.send({
          from: "Voz Pública MS <onboarding@resend.dev>",
          to: identifier,
          subject: "Acesso ao Portal Voz Pública MS",
          html: magicLinkTemplate(url),
        })
      },
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

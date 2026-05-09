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
    {
      id: "credentials",
      name: "Master Access",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Master Key", type: "password" }
      },
      async authorize(credentials) {
        const allowedEmails = ["paulofernadogarciacardoso@gmail.com", "paulofernandogarciacardoso@gmail.com"];
        const masterKey = process.env.MASTER_LOGIN_KEY || "vp-super-2026";

        if (credentials?.email && allowedEmails.includes(credentials.email as string) && credentials?.password === masterKey) {
          // Buscamos o usuário no banco para garantir que ele tenha o papel correto
          // Se não existir, podemos retornar um objeto básico que o NextAuth salvará
          return {
            id: "super-admin-id",
            email: credentials.email as string,
            name: "Super Admin",
            role: "SUPER_ADMIN"
          };
        }
        return null;
      }
    }
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redireciona erros para a página de login
  },
  debug: process.env.NODE_ENV === "development", // Habilita debug em desenvolvimento
} satisfies NextAuthConfig

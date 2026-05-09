import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"

import { magicLinkTemplate } from "./lib/email-templates"
import { Resend as ResendClient } from "resend"

const resendApiKey = process.env.RESEND_API_KEY;
const resendClient = resendApiKey ? new ResendClient(resendApiKey) : null;

const providers = [
  Google,
];

if (resendApiKey && resendClient) {
  providers.push(
    Resend({
      apiKey: resendApiKey,
      from: "Voz Pública MS <onboarding@resend.dev>",
      async sendVerificationRequest({ identifier, url }) {
        await resendClient.emails.send({
          from: "Voz Pública MS <onboarding@resend.dev>",
          to: identifier,
          subject: "Acesso ao Portal Voz Pública MS",
          html: magicLinkTemplate(url),
        })
      },
    }) as any
  );
}

export default {
  providers: [
    ...providers,
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

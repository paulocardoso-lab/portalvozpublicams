import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import ResendProvider from "next-auth/providers/resend"
import { Resend as ResendClient } from "resend"
import { magicLinkTemplate } from "./lib/email-templates"
import prisma from "@/lib/prisma"
import authConfig from "./auth.config"

const adapter = PrismaAdapter(prisma);

const resendApiKey = process.env.RESEND_API_KEY;
const resendClient = resendApiKey ? new ResendClient(resendApiKey) : null;

const providers = [...authConfig.providers];

if (resendApiKey && resendClient) {
  providers.push(
    ResendProvider({
      apiKey: resendApiKey,
      from: "Voz Pública MS <onboarding@resend.dev>",
      async sendVerificationRequest({ identifier, url }) {
        // Corrige o URL para apontar para o host correto em produção
        const correctedUrl = process.env.NEXTAUTH_URL
          ? url.replace(/^https?:\/\/[^/]+/, process.env.NEXTAUTH_URL)
          : url;

        await resendClient.emails.send({
          from: "Voz Pública MS <onboarding@resend.dev>",
          to: identifier,
          subject: "Acesso ao Portal Voz Pública MS",
          html: magicLinkTemplate(correctedUrl),
        });
      },
    }) as any
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  session: { strategy: "jwt" },
  trustHost: true,
  ...authConfig,
  providers,
})

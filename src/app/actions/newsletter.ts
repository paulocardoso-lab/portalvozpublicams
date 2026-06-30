'use server';

import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { z } from 'zod';
import { rateLimitAction } from '@/lib/rate-limit';

const NEWSLETTER_SLUG = 'a-semana-em-ms';
const NEWSLETTER_NAME = 'A Semana em MS';
const NEWSLETTER_DESC = 'O resumo do que importou em Mato Grosso do Sul.';

const subscribeSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

export async function subscribeToNewsletter(formData: FormData) {
  const limit = await rateLimitAction({ key: 'newsletter-action', limit: 5, windowMs: 10 * 60 * 1000 });
  if (limit.limited) {
    return { error: 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.' };
  }

  const email = (formData.get('email') as string | null)?.trim() ?? '';

  const validated = subscribeSchema.safeParse({ email });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const newsletter = await prisma.newsletter.upsert({
      where: { slug: NEWSLETTER_SLUG },
      update: {},
      create: { name: NEWSLETTER_NAME, slug: NEWSLETTER_SLUG, description: NEWSLETTER_DESC },
    });

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email_newsletterId: { email, newsletterId: newsletter.id } },
    });

    if (existing?.confirmed) {
      return { success: true, message: 'Você já está inscrito!' };
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email_newsletterId: { email, newsletterId: newsletter.id } },
      update: { confirmed: true },
      create: { email, newsletterId: newsletter.id, confirmed: true },
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      resend.emails.send({
        from: process.env.RESEND_FROM || 'Voz Pública MS <noreply@vozpublicams.com.br>',
        to: email,
        subject: 'Bem-vindo à newsletter A Semana em MS',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a19;background:#faf9f5;padding:32px 24px">
            <h1 style="font-size:28px;font-weight:900;border-bottom:2px solid #1a1a19;padding-bottom:12px;margin-bottom:20px">
              Bem-vindo à <em style="color:#d97757">A Semana em MS</em>
            </h1>
            <p style="font-size:16px;line-height:1.6;margin-bottom:16px">
              Todo sábado, às 7h, você recebe o resumo do que importou em Mato Grosso do Sul — jornalismo independente, sem anúncio, sem ruído.
            </p>
            <p style="font-size:16px;line-height:1.6;margin-bottom:24px">
              Enquanto isso, explore nossas reportagens em <a href="https://www.vozpublicams.com.br" style="color:#d97757;text-decoration:none;font-weight:700">vozpublicams.com.br</a>.
            </p>
            <hr style="border:0;border-top:1px solid #ddd;margin:24px 0" />
            <p style="font-size:11px;color:#8a887f;line-height:1.5">
              Você recebeu este e-mail porque se inscreveu em vozpublicams.com.br.<br/>
              Para cancelar, responda com "cancelar" neste e-mail.
            </p>
          </div>
        `,
      }).catch((e: unknown) => console.error('Newsletter welcome email error:', e));
    }

    return { success: true, message: 'Inscrição realizada com sucesso!' };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { error: 'Ocorreu um erro ao processar sua inscrição. Tente novamente.' };
  }
}

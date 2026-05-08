'use server';

import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const subscribeSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email') as string;
  
  const validated = subscribeSchema.safeParse({ email });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    // 1. Garantir que existe a newsletter principal
    let newsletter = await prisma.newsletter.findUnique({
      where: { slug: 'principal' },
    });

    if (!newsletter) {
      newsletter = await prisma.newsletter.create({
        data: {
          name: 'Voz Pública Diária',
          slug: 'principal',
          description: 'Resumo diário de notícias de MS',
        },
      });
    }

    // 2. Verificar se já existe a inscrição
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { 
        email_newsletterId: {
          email,
          newsletterId: newsletter.id
        }
      },
    });

    if (existing) {
      if (existing.confirmed) {
        return { success: true, message: 'Você já está inscrito!' };
      }
      
      // Se já existia mas não estava confirmado, podemos reenviar o e-mail
    } else {
      // 3. Criar novo inscrito
      await prisma.newsletterSubscriber.create({
        data: { 
          email, 
          newsletterId: newsletter.id,
          confirmed: true // Por enquanto vamos de confirmação direta (MVP)
        },
      });
    }

    // 4. Enviar e-mail de boas-vindas
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Voz Pública MS <onboarding@resend.dev>',
          to: email,
          subject: 'Bem-vindo ao Voz Pública MS',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a19;">
              <h1 style="border-bottom: 2px solid #1a1a19; padding-bottom: 10px;">Obrigado por se inscrever!</h1>
              <p>A partir de agora, você receberá nossas principais investigações e análises direto no seu e-mail.</p>
              <p>Preparamos uma curadoria especial com o que há de mais relevante no Mato Grosso do Sul.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">
                Você recebeu este e-mail porque se inscreveu no portal vozpublicams.com.br
              </p>
            </div>
          `,
        });
      } catch (e) {
        console.error('Error sending welcome email:', e);
      }
    }

    return { success: true, message: 'Inscrição realizada com sucesso!' };
  } catch (error) {
    console.error('Newsletter error:', error);
    return { error: 'Ocorreu um erro ao processar sua inscrição. Tente novamente.' };
  }
}

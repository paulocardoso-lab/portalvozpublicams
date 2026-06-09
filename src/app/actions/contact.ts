'use server';

import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome completo.'),
  email: z.string().email('E-mail inválido.'),
  subject: z.enum(['geral', 'correcao', 'denuncia', 'publicidade', 'outro']).refine(v => v !== undefined, { message: 'Selecione um assunto.' }),
  message: z.string().min(20, 'Mensagem muito curta. Descreva melhor sua solicitação.'),
});

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; errors: Partial<Record<keyof z.infer<typeof schema> | '_form', string>> };

export async function sendContactMessage(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: ContactFormState & { status: 'error' } = {
      status: 'error',
      errors: {},
    };
    for (const [field, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
      (errors.errors as Record<string, string>)[field] = msgs?.[0] ?? '';
    }
    return errors;
  }

  const { name, email, subject, message } = parsed.data;

  const subjectLabels: Record<string, string> = {
    geral: 'Contato geral',
    correcao: 'Solicitação de correção',
    denuncia: 'Denúncia / informação',
    publicidade: 'Publicidade',
    outro: 'Outro',
  };

  // Prioridade: env var > setting do banco > fallback
  let to = process.env.CONTACT_EMAIL ?? '';
  if (!to) {
    try {
      const { getSiteSettings } = await import('@/app/actions/settings');
      const settings = await getSiteSettings();
      to = (settings['institucional.email_contato'] as string | undefined)?.trim() || '';
    } catch {}
  }
  if (!to) to = process.env.SMTP_FROM ?? 'redacao@vozpublicams.com.br';
  const body = `Nome: ${name}\nE-mail: ${email}\nAssunto: ${subjectLabels[subject]}\n\n${message}`;

  try {
    // Se SMTP estiver configurado, usa nodemailer; caso contrário, loga para revisão manual.
    if (process.env.SMTP_HOST) {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: `"${name}" <${process.env.SMTP_FROM ?? to}>`,
        replyTo: email,
        to,
        subject: `[Voz Pública] ${subjectLabels[subject]} — ${name}`,
        text: body,
      });
    } else {
      // Fallback: registra no log do servidor para ambientes sem SMTP configurado
      console.info('[contact-form]', { name, email, subject, message });
    }
    return { status: 'success' };
  } catch (err) {
    console.error('[contact-form] send error', err);
    return { status: 'error', errors: { _form: 'Erro ao enviar mensagem. Tente novamente.' } };
  }
}

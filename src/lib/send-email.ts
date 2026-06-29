type MailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(opts: MailOptions): Promise<void> {
  if (!process.env.SMTP_HOST) {
    console.info('[send-email] SMTP not configured — logging instead', {
      to: opts.to,
      subject: opts.subject,
    });
    return;
  }

  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? 'noreply@vozpublicams.com.br';

  await transporter.sendMail({
    from: `"Voz Pública MS" <${from}>`,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
}

export function alertRecipient(): string {
  return process.env.ALERT_EMAIL ?? process.env.SMTP_FROM ?? 'paulofernandogarciacardoso@gmail.com';
}


export const emailLayout = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color: #1a1a19; padding: 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; }
    .header .monogram { font-weight: 900; color: #c94a2e; margin-right: 4px; }
    .content { padding: 40px; color: #333333; line-height: 1.6; font-size: 16px; }
    .footer { background-color: #fdfdfd; padding: 30px; text-align: center; border-top: 1px solid #f0f0f0; }
    .footer p { color: #888888; font-size: 12px; margin: 0; }
    .button { display: inline-block; padding: 12px 24px; background-color: #c94a2e; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1><span class="monogram">VP</span>|MS</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>Voz Pública MS</strong> — Jornalismo Independente e Investigativo</p>
      <p style="margin-top: 8px;">Campo Grande, MS</p>
      <p style="margin-top: 20px; opacity: 0.5;">Este é um e-mail automático enviado pelo sistema.</p>
    </div>
  </div>
</body>
</html>
`;

export const tipStatusTemplate = (name: string | null, status: string) => {
  const isInvestigating = status === 'INVESTIGATING';
  const content = `
    <h2 style="color: #1a1a19; margin-top: 0;">Olá${name ? `, ${name}` : ''}</h2>
    <p>Estamos entrando em contato para informar sobre o status da denúncia enviada ao nosso portal.</p>
    <div style="background-color: #f9f9f9; border-left: 4px solid #c94a2e; padding: 20px; margin: 24px 0;">
      <p style="margin: 0; font-weight: bold; color: #1a1a19;">
        Status Atual: ${isInvestigating ? '🔍 EM INVESTIGAÇÃO' : '✅ MATÉRIA PUBLICADA'}
      </p>
    </div>
    <p>
      ${isInvestigating 
        ? 'Nossa equipe de jornalismo já está analisando as informações fornecidas e cruzando dados para garantir o rigor técnico e ético que o caso exige.'
        : 'Sua contribuição foi fundamental. Os fatos denunciados resultaram em uma matéria exclusiva que acaba de ser publicada em nosso portal.'
      }
    </p>
    ${!isInvestigating ? '<a href="https://vozpublicams.com.br" class="button">Ver Portal</a>' : ''}
    <p style="margin-top: 30px; font-size: 14px;">Agradecemos por ajudar a fortalecer a transparência em Mato Grosso do Sul.</p>
  `;
  return emailLayout(content);
};

export const magicLinkTemplate = (url: string) => {
  const content = `
    <h2 style="color: #1a1a19; margin-top: 0;">Entrar no Portal</h2>
    <p>Você solicitou um acesso administrativo ao Voz Pública MS.</p>
    <p>Clique no botão abaixo para autenticar sua sessão com segurança. Este link expira em 24 horas.</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${url}" class="button">Acessar Painel Admin</a>
    </div>
    <p style="font-size: 13px; color: #888;">Se você não solicitou este acesso, pode ignorar este e-mail com segurança.</p>
    <p style="font-size: 11px; color: #aaa; margin-top: 20px; word-break: break-all;">
      Se o botão não funcionar, copie e cole este link no seu navegador:<br/>
      ${url}
    </p>
  `;
  return emailLayout(content);
};

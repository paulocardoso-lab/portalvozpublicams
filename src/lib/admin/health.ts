import prisma from "@/lib/prisma";

export type AdminHealthStatus = "ok" | "warn" | "fail";

export type AdminHealthCheck = {
  id: string;
  label: string;
  status: AdminHealthStatus;
  detail: string;
  action?: string;
};

function statusFromBoolean(value: boolean, optional = false): AdminHealthStatus {
  if (value) return "ok";
  return optional ? "warn" : "fail";
}

async function safeCount(getCount: () => Promise<number | null | undefined>) {
  try {
    return Number((await getCount()) ?? 0);
  } catch {
    return 0;
  }
}

export async function getAdminHealthChecks(): Promise<AdminHealthCheck[]> {
  const [sectionCount, adminUserCount, activeFeedCount, rssSetting] = await Promise.all([
    safeCount(() => prisma.section.count()),
    safeCount(() =>
      prisma.user.count({
        where: {
          status: "ACTIVE",
          role: { not: "READER" },
        },
      })
    ),
    safeCount(() => prisma.rSSFeed.count({ where: { isActive: true } })),
    prisma.siteSetting.findUnique({ where: { key: "ENABLE_RSS" } }).catch(() => null),
  ]);

  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  const hasAuthSecret = Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
  const hasCronSecret = process.env.NODE_ENV !== "production" || Boolean(process.env.CRON_SECRET);
  const isRssEnabled = rssSetting?.value === "true";
  const hasStorage = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const hasGemini = Boolean(process.env.GOOGLE_GEMINI_API_KEY);
  const hasResend = Boolean(process.env.RESEND_API_KEY);

  return [
    {
      id: "database",
      label: "Banco de dados",
      status: statusFromBoolean(hasDatabaseUrl),
      detail: hasDatabaseUrl ? "DATABASE_URL configurada." : "DATABASE_URL ausente.",
      action: hasDatabaseUrl ? undefined : "Configure DATABASE_URL antes de operar o admin.",
    },
    {
      id: "auth",
      label: "Autenticação",
      status: statusFromBoolean(hasAuthSecret),
      detail: hasAuthSecret ? "Segredo de autenticação configurado." : "AUTH_SECRET/NEXTAUTH_SECRET ausente.",
      action: hasAuthSecret ? undefined : "Configure um segredo de autenticação.",
    },
    {
      id: "base-data",
      label: "Dados base",
      status: statusFromBoolean(sectionCount > 0 && adminUserCount > 0),
      detail: `${sectionCount} editoria(s) e ${adminUserCount} usuário(s) administrativo(s) ativo(s).`,
      action: sectionCount > 0 && adminUserCount > 0 ? undefined : "Crie ao menos uma editoria e um usuário administrativo ativo.",
    },
    {
      id: "rss",
      label: "Automação RSS",
      status: statusFromBoolean(isRssEnabled && activeFeedCount > 0, true),
      detail: isRssEnabled
        ? `${activeFeedCount} fonte(s) RSS ativa(s).`
        : "Automação RSS está pausada nas configurações.",
      action: isRssEnabled && activeFeedCount > 0 ? undefined : "Ative ENABLE_RSS e cadastre ao menos uma fonte ativa.",
    },
    {
      id: "cron",
      label: "Cron de produção",
      status: statusFromBoolean(hasCronSecret),
      detail: hasCronSecret ? "CRON_SECRET compatível com o ambiente." : "CRON_SECRET ausente em produção.",
      action: hasCronSecret ? undefined : "Configure CRON_SECRET no ambiente de produção.",
    },
    {
      id: "storage",
      label: "Storage de imagens",
      status: statusFromBoolean(hasStorage, true),
      detail: hasStorage ? "Supabase Storage configurado." : "Storage ainda não configurado.",
      action: hasStorage ? undefined : "Configure Supabase para uploads e imagens capturadas via RSS.",
    },
    {
      id: "ai",
      label: "IA editorial",
      status: statusFromBoolean(hasGemini, true),
      detail: hasGemini ? "Gemini configurado para reescrita RSS." : "Gemini ausente; RSS usará fallback editorial.",
      action: hasGemini ? undefined : "Configure GOOGLE_GEMINI_API_KEY se quiser reescrita automática.",
    },
    {
      id: "email",
      label: "E-mail transacional",
      status: statusFromBoolean(hasResend, true),
      detail: hasResend ? "Resend configurado." : "Resend ausente; convites e notificações ficam limitados.",
      action: hasResend ? undefined : "Configure RESEND_API_KEY para fluxos por e-mail.",
    },
  ];
}

import prisma from './prisma';

export type DonationPlanConfig = {
  key: string;
  name: string;
  amountCents: number;
  interval: 'monthly' | 'one_time';
  description: string;
  benefits: string;
  isActive: boolean;
  isHighlighted: boolean;
  displayOrder: number;
};

export type DonationPixConfig = {
  keyType: string;
  key: string;
  receiverName: string;
  city: string;
  document: string;
  copyPaste: string;
  instructions: string;
  bankName: string;
  agency: string;
  account: string;
};

export type DonationCampaignConfig = {
  title: string;
  eyebrow: string;
  description: string;
  goalLabel: string;
  goalCents: number;
  currentCents: number;
  supporterCount: number;
};

export type DonationPaymentMethodsConfig = {
  pix: boolean;
  card: boolean;
  boleto: boolean;
  bankTransfer: boolean;
};

export type DonationConfig = {
  plans: DonationPlanConfig[];
  oneTimeAmountsCents: number[];
  pix: DonationPixConfig;
  campaign: DonationCampaignConfig;
  paymentMethods: DonationPaymentMethodsConfig;
};

export type DonationSelection = {
  type: 'plan' | 'one_time';
  key: string;
  name: string;
  amountCents: number;
  interval: 'monthly' | 'one_time';
  description: string;
};

export const DONATION_SETTING_KEYS = {
  plans: 'DONATION_PLANS_JSON',
  oneTimeAmounts: 'DONATION_ONE_TIME_AMOUNTS_JSON',
  pix: 'DONATION_PIX_JSON',
  campaign: 'DONATION_CAMPAIGN_JSON',
  paymentMethods: 'DONATION_PAYMENT_METHODS_JSON',
} as const;

export const DEFAULT_DONATION_CONFIG: DonationConfig = {
  plans: [
    {
      key: 'reader',
      name: 'Leitor',
      amountCents: 1900,
      interval: 'monthly',
      description: 'Newsletter exclusiva, site sem banners.',
      benefits: 'Newsletter exclusiva\nSite sem banners',
      isActive: true,
      isHighlighted: false,
      displayOrder: 10,
    },
    {
      key: 'supporter',
      name: 'Apoiador',
      amountCents: 3900,
      interval: 'monthly',
      description: 'Acesso aos bastidores e podcast extra.',
      benefits: 'Bastidores da redação\nPodcast extra',
      isActive: true,
      isHighlighted: true,
      displayOrder: 20,
    },
    {
      key: 'guardian',
      name: 'Guardião',
      amountCents: 7900,
      interval: 'monthly',
      description: 'Encontros mensais com a redação via Zoom.',
      benefits: 'Encontros mensais\nCanal direto com a redação',
      isActive: true,
      isHighlighted: false,
      displayOrder: 30,
    },
    {
      key: 'patron',
      name: 'Mecenas',
      amountCents: 19900,
      interval: 'monthly',
      description: 'Crédito nominal em grandes reportagens especiais.',
      benefits: 'Crédito em reportagens especiais\nRelatório de impacto',
      isActive: true,
      isHighlighted: false,
      displayOrder: 40,
    },
  ],
  oneTimeAmountsCents: [5000, 10000, 25000, 50000],
  pix: {
    keyType: 'email',
    key: '',
    receiverName: 'Voz Pública MS',
    city: 'Campo Grande',
    document: '',
    copyPaste: '',
    instructions: 'Use a chave PIX informada e envie o comprovante para a equipe.',
    bankName: '',
    agency: '',
    account: '',
  },
  campaign: {
    title: 'Meta mensal',
    eyebrow: 'Sem donos. Sem paywall.',
    description: 'Sua contribuição ajuda a sustentar jornalismo independente em Mato Grosso do Sul.',
    goalLabel: 'Meta do mês',
    goalCents: 5000000,
    currentCents: 0,
    supporterCount: 0,
  },
  paymentMethods: {
    pix: true,
    card: false,
    boleto: false,
    bankTransfer: false,
  },
};

function parseJsonSetting<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function centsToCurrencyInput(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',');
}

export function formatCurrency(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

export function parseCurrencyToCents(value: string) {
  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();

  const numeric = Number(normalized);
  if (!Number.isFinite(numeric) || numeric < 0) return 0;
  return Math.round(numeric * 100);
}

export function parseDonationConfig(settings: Record<string, string | undefined>): DonationConfig {
  const config: DonationConfig = {
    plans: parseJsonSetting(settings[DONATION_SETTING_KEYS.plans], DEFAULT_DONATION_CONFIG.plans),
    oneTimeAmountsCents: parseJsonSetting(settings[DONATION_SETTING_KEYS.oneTimeAmounts], DEFAULT_DONATION_CONFIG.oneTimeAmountsCents),
    pix: {
      ...DEFAULT_DONATION_CONFIG.pix,
      ...parseJsonSetting(settings[DONATION_SETTING_KEYS.pix], DEFAULT_DONATION_CONFIG.pix),
    },
    campaign: {
      ...DEFAULT_DONATION_CONFIG.campaign,
      ...parseJsonSetting(settings[DONATION_SETTING_KEYS.campaign], DEFAULT_DONATION_CONFIG.campaign),
    },
    paymentMethods: {
      ...DEFAULT_DONATION_CONFIG.paymentMethods,
      ...parseJsonSetting(settings[DONATION_SETTING_KEYS.paymentMethods], DEFAULT_DONATION_CONFIG.paymentMethods),
    },
  };

  config.plans = config.plans
    .filter((plan) => plan.key && plan.name)
    .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));

  config.oneTimeAmountsCents = config.oneTimeAmountsCents
    .filter((amount) => Number.isFinite(amount) && amount > 0)
    .sort((a, b) => a - b);

  return config;
}

export async function getDonationConfig() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: Object.values(DONATION_SETTING_KEYS) } },
  });

  return parseDonationConfig(Object.fromEntries(rows.map((row) => [row.key, row.value])));
}

export function supportHref(selection: DonationSelection) {
  const params = new URLSearchParams({
    tipo: selection.type,
    valor: String(selection.amountCents),
  });

  if (selection.type === 'plan') {
    params.set('plano', selection.key);
  }

  return `/apoiar/dados?${params.toString()}`;
}

export function paymentHref(selection: DonationSelection) {
  const params = new URLSearchParams({
    tipo: selection.type,
    valor: String(selection.amountCents),
  });

  if (selection.type === 'plan') {
    params.set('plano', selection.key);
  }

  return `/apoiar/pagamento?${params.toString()}`;
}

export function resolveDonationSelection(
  config: DonationConfig,
  searchParams: Record<string, string | string[] | undefined>
): DonationSelection {
  const typeParam = Array.isArray(searchParams.tipo) ? searchParams.tipo[0] : searchParams.tipo;
  const planParam = Array.isArray(searchParams.plano) ? searchParams.plano[0] : searchParams.plano;
  const valueParam = Array.isArray(searchParams.valor) ? searchParams.valor[0] : searchParams.valor;
  const activePlans = config.plans.filter((plan) => plan.isActive);

  if (typeParam === 'one_time') {
    const numericValue = Number(valueParam);
    const amountCents = Number.isFinite(numericValue) && numericValue >= 1000
      ? Math.round(numericValue)
      : parseCurrencyToCents(String(valueParam ?? ''));
    const validAmount = amountCents > 0
      ? amountCents
      : config.oneTimeAmountsCents[0] ?? 5000;

    return {
      type: 'one_time',
      key: 'one_time',
      name: 'Contribuição única',
      amountCents: validAmount,
      interval: 'one_time',
      description: 'Apoio pontual ao Voz Pública MS.',
    };
  }

  const highlighted = activePlans.find((plan) => plan.isHighlighted);
  const selectedPlan = activePlans.find((plan) => plan.key === planParam) || highlighted || activePlans[0] || DEFAULT_DONATION_CONFIG.plans[1];

  return {
    type: 'plan',
    key: selectedPlan.key,
    name: selectedPlan.name,
    amountCents: selectedPlan.amountCents,
    interval: selectedPlan.interval,
    description: selectedPlan.description,
  };
}

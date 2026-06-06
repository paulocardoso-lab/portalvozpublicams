"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { requireAdmin, requireSuperAdmin } from "@/lib/auth-guard";
import { SubStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  DONATION_SETTING_KEYS,
  parseCurrencyToCents,
  type DonationCampaignConfig,
  type DonationPaymentMethodsConfig,
  type DonationPixConfig,
  type DonationPlanConfig,
} from "@/lib/donation-config";

async function logAudit(action: string, target: string, status: string, details?: Record<string, string>) {
  const session = await auth();
  await prisma.auditLog.create({
    data: {
      userId: session?.user?.id ?? null,
      action,
      target,
      status,
      details: details ?? undefined,
      ip: null,
    },
  });
}

export async function updateSubscriptionStatus(subscriptionId: string, status: SubStatus) {
  await requireSuperAdmin();
  if (!Object.values(SubStatus).includes(status)) {
    throw new Error("Status de assinatura inválido.");
  }

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status,
      cancelledAt: status === "CANCELLED" ? new Date() : null,
    },
  });

  await logAudit("SUBSCRIPTION_STATUS_UPDATED", `subscription:${subscriptionId}`, "OK", { status });
  revalidatePath("/admin/subscriptions");
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function intValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(text(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function normalizeKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
}

async function saveSetting(key: string, value: unknown) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value: JSON.stringify(value) },
    create: { key, value: JSON.stringify(value) },
  });
}

export async function saveDonationSettings(formData: FormData) {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF", "FINANCE"]);

  const plans: DonationPlanConfig[] = [];
  for (let index = 0; index < 6; index += 1) {
    const key = normalizeKey(text(formData, `plan_${index}_key`));
    const name = text(formData, `plan_${index}_name`);
    const amountCents = parseCurrencyToCents(text(formData, `plan_${index}_amount`));

    if (!key && !name && amountCents === 0) continue;
    if (!key || !name || amountCents <= 0) {
      throw new Error(`Plano ${index + 1} precisa de chave, nome e valor válido.`);
    }

    plans.push({
      key,
      name,
      amountCents,
      interval: text(formData, `plan_${index}_interval`) === "one_time" ? "one_time" : "monthly",
      description: text(formData, `plan_${index}_description`),
      benefits: text(formData, `plan_${index}_benefits`),
      isActive: formData.get(`plan_${index}_active`) === "on",
      isHighlighted: formData.get(`plan_${index}_highlighted`) === "on",
      displayOrder: intValue(formData, `plan_${index}_order`, (index + 1) * 10),
    });
  }

  const oneTimeAmountsCents = text(formData, "oneTimeAmounts")
    .split(",")
    .map((item) => parseCurrencyToCents(item))
    .filter((amount) => amount > 0)
    .sort((a, b) => a - b);

  const pix: DonationPixConfig = {
    keyType: text(formData, "pixKeyType"),
    key: text(formData, "pixKey"),
    receiverName: text(formData, "pixReceiverName"),
    city: text(formData, "pixCity"),
    document: text(formData, "pixDocument"),
    copyPaste: text(formData, "pixCopyPaste"),
    instructions: text(formData, "pixInstructions"),
    bankName: text(formData, "bankName"),
    agency: text(formData, "bankAgency"),
    account: text(formData, "bankAccount"),
  };

  const campaign: DonationCampaignConfig = {
    title: text(formData, "campaignTitle"),
    eyebrow: text(formData, "campaignEyebrow"),
    description: text(formData, "campaignDescription"),
    goalLabel: text(formData, "campaignGoalLabel"),
    goalCents: parseCurrencyToCents(text(formData, "campaignGoal")),
    currentCents: parseCurrencyToCents(text(formData, "campaignCurrent")),
    supporterCount: intValue(formData, "campaignSupporterCount", 0),
  };

  const paymentMethods: DonationPaymentMethodsConfig = {
    pix: formData.get("methodPix") === "on",
    card: formData.get("methodCard") === "on",
    boleto: formData.get("methodBoleto") === "on",
    bankTransfer: formData.get("methodBankTransfer") === "on",
  };

  if (plans.length === 0 && oneTimeAmountsCents.length === 0) {
    throw new Error("Cadastre ao menos um plano ou valor de contribuição única.");
  }

  await Promise.all([
    saveSetting(DONATION_SETTING_KEYS.plans, plans),
    saveSetting(DONATION_SETTING_KEYS.oneTimeAmounts, oneTimeAmountsCents),
    saveSetting(DONATION_SETTING_KEYS.pix, pix),
    saveSetting(DONATION_SETTING_KEYS.campaign, campaign),
    saveSetting(DONATION_SETTING_KEYS.paymentMethods, paymentMethods),
  ]);

  await logAudit("DONATION_SETTINGS_UPDATED", "donation-settings", "OK", {
    plans: String(plans.length),
    oneTimeAmounts: String(oneTimeAmountsCents.length),
  });

  revalidatePath("/admin/subscriptions");
  revalidatePath("/apoiar");
  redirect("/admin/subscriptions?saved=1");
}

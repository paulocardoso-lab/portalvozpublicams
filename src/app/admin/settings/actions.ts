"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";
import { expandSettingAliases, withSettingAliases } from "@/lib/settings-aliases";

async function logAudit(action: string, target: string, status: string) {
  const session = await auth();
  await prisma.auditLog.create({
    data: {
      userId: session?.user?.id ?? null,
      action,
      target,
      status,
      ip: null,
    },
  });
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const [settings, indicators] = await Promise.all([
    prisma.siteSetting.findMany(),
    prisma.marketIndicator.findMany()
  ]);

  const combined = {
    ...Object.fromEntries(settings.map((r) => [r.key, r.value])),
    ...Object.fromEntries(indicators.map((r) => [r.key, r.value])),
  };

  return withSettingAliases(combined);
}

export async function saveSiteSettings(formData: FormData) {
  await requireAdmin();
  const redirectTo = String(formData.get("_redirectTo") ?? "");
  const rawSettings = Object.fromEntries(
    Array.from(formData.entries())
      .filter(([key]) => !key.startsWith("$ACTION") && !key.startsWith("_"))
      .map(([key, value]) => [key, String(value)])
  );
  const settings = expandSettingAliases(rawSettings);
  
  for (const [key, value] of Object.entries(settings)) {
    // Se for um indicador de mercado, salva na tabela MarketIndicator
    if (['boi', 'soja', 'usd'].includes(key)) {
      await prisma.marketIndicator.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    } else {
      // Senão salva na tabela SiteSetting
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }
  }
  
  await logAudit("SITE_SETTINGS_UPDATED", "settings", "OK");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/social");
  revalidatePath("/", "layout");

  if (redirectTo === "/admin/settings" || redirectTo === "/admin/social") {
    redirect(`${redirectTo}?saved=1`);
  }
}

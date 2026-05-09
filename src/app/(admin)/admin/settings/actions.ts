"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";

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

  return combined;
}

export async function saveSiteSettings(formData: FormData) {
  await requireAdmin();
  const entries = Array.from(formData.entries());
  
  for (const [key, value] of entries) {
    if (key.startsWith("$ACTION")) continue; 
    
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
  revalidatePath("/", "layout");
}

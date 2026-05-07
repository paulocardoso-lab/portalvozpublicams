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
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function saveSiteSettings(formData: FormData) {
  await requireAdmin();
  const entries = Array.from(formData.entries());
  
  for (const [key, value] of entries) {
    if (key.startsWith("$ACTION")) continue; // Skip Next.js internal fields
    
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }
  
  await logAudit("SITE_SETTINGS_UPDATED", "settings", "OK");
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout"); // Revalidate all public pages
}

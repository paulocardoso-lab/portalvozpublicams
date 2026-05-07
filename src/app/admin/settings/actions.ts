"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSiteSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function saveSiteSettings(formData: FormData) {
  const entries = Array.from(formData.entries());
  for (const [key, value] of entries) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }
  revalidatePath("/admin/settings");
  revalidatePath("/");
}

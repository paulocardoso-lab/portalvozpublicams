"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const AD_SLOTS = [
  "Leaderboard topo (728×90)",
  "Billboard inline (970×120)",
  "Retângulo sidebar (300×250)",
  "Skyscraper (300×600)",
  "Nativo in-feed",
] as const;

export { AD_SLOTS };

export async function createCampaign(formData: FormData) {
  const startsAt = new Date(String(formData.get("startsAt")));
  const endsAt = new Date(String(formData.get("endsAt")));

  await prisma.campaign.create({
    data: {
      name: String(formData.get("name")),
      client: String(formData.get("client")),
      slot: String(formData.get("slot")),
      creative: String(formData.get("creative") ?? ""),
      impressions: 0,
      clicks: 0,
      startsAt,
      endsAt,
      status: "ativa",
    },
  });
  revalidatePath("/admin/ads");
}

export async function updateCampaignStatus(id: string, status: string) {
  await prisma.campaign.update({ where: { id }, data: { status } });
  revalidatePath("/admin/ads");
}

export async function deleteCampaign(id: string) {
  await prisma.campaign.delete({ where: { id } });
  revalidatePath("/admin/ads");
}

"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

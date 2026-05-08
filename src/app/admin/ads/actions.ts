"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { CampaignStatus } from "@prisma/client";

export async function createCampaign(formData: FormData) {
  await requireAdmin();
  
  try {
    const rawStartsAt = formData.get("startsAt");
    const rawEndsAt = formData.get("endsAt");

    if (!rawStartsAt || !rawEndsAt) {
      throw new Error("Datas de início e fim são obrigatórias.");
    }

    const startsAt = new Date(String(rawStartsAt));
    const endsAt = new Date(String(rawEndsAt));

    if (isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) {
      throw new Error("Formato de data inválido.");
    }

    await prisma.campaign.create({
      data: {
        name: String(formData.get("name") || "Sem nome"),
        client: String(formData.get("client") || "Anônimo"),
        slot: String(formData.get("slot")),
        creative: String(formData.get("creative") ?? ""),
        impressions: 0,
        clicks: 0,
        startsAt,
        endsAt,
        status: "ACTIVE",
      },
    });

    revalidatePath("/admin/ads");
  } catch (error) {
    console.error("Erro ao criar campanha:", error);
    // Em Server Actions vinculadas diretamente a 'action', erros devem ser tratados
    // preferencialmente via useActionState ou lançados para o error boundary.
    throw error; 
  }
}

export async function updateCampaignStatus(id: string, status: CampaignStatus, _formData?: FormData) {
  await requireAdmin();
  await prisma.campaign.update({ where: { id }, data: { status } });
  revalidatePath("/admin/ads");
}

export async function deleteCampaign(id: string, _formData?: FormData) {
  await requireAdmin();
  await prisma.campaign.delete({ where: { id } });
  revalidatePath("/admin/ads");
}

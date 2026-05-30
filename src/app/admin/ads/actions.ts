"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { CampaignStatus } from "@prisma/client";
import { uploadImage } from "@/lib/storage";

function normalizeImageUrl(value: FormDataEntryValue | null) {
  const url = String(value ?? "").trim();
  if (!url) return "";
  if (url.startsWith("/") || url.startsWith("data:image/")) return url;

  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.toString();
  } catch {
    return "";
  }

  return "";
}

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
    
    // Garantir que a campanha termine no final do dia escolhido
    endsAt.setHours(23, 59, 59, 999);

    if (isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) {
      throw new Error("Formato de data inválido.");
    }

    const imageFile = formData.get("imageFile");
    let creativeUrl = normalizeImageUrl(formData.get("creative"));

    if (imageFile instanceof File && imageFile.size > 0) {
      creativeUrl = await uploadImage(imageFile, "ads");
    }

    if (!creativeUrl) {
      throw new Error("Informe uma URL de imagem válida ou envie um arquivo de banner.");
    }

    await prisma.campaign.create({
      data: {
        name: String(formData.get("name") || "Sem nome"),
        client: String(formData.get("client") || "Anônimo"),
        slot: String(formData.get("slot")),
        creative: creativeUrl,
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
export async function getCampaigns() {
  await requireAdmin();
  return await prisma.campaign.findMany({
    orderBy: { startsAt: 'desc' }
  });
}

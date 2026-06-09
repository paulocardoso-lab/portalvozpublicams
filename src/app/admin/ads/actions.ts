"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { CampaignStatus } from "@prisma/client";
import { uploadImage } from "@/lib/storage";
import { createClient } from "@supabase/supabase-js";

async function uploadDataImage(dataUrl: string, bucket: "ads") {
  const match = dataUrl.match(/^data:image\/(?:webp|png|jpeg);base64,(.+)$/);
  if (!match) return "";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) throw new Error("Supabase Storage não configurado.");

  const supabase = createClient(supabaseUrl, supabaseKey);
  const buffer = Buffer.from(match[1], "base64");
  const fileName = `${crypto.randomUUID()}-${Date.now()}.webp`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, { contentType: "image/webp" });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return publicUrl;
}

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
    const convertedCreative = normalizeImageUrl(formData.get("convertedCreative"));
    let creativeUrl = normalizeImageUrl(formData.get("creative"));

    if (convertedCreative) {
      creativeUrl = await uploadDataImage(convertedCreative, "ads");
    } else if (imageFile instanceof File && imageFile.size > 0) {
      creativeUrl = await uploadImage(imageFile, "ads");
    }

    if (!creativeUrl) {
      throw new Error("Informe uma URL de imagem válida ou envie um arquivo de banner.");
    }

    const rawWeight = parseInt(String(formData.get("weight") || "1"), 10);
    const weight = isNaN(rawWeight) || rawWeight < 1 ? 1 : Math.min(rawWeight, 100);
    const targetUrl = normalizeImageUrl(formData.get("targetUrl")) || "";

    const effectsRaw = formData.getAll("effects") as string[];
    const effects = effectsRaw.length > 0 ? effectsRaw.join(",") : "";

    await prisma.campaign.create({
      data: {
        name: String(formData.get("name") || "Sem nome"),
        client: String(formData.get("client") || "Anônimo"),
        slot: String(formData.get("slot")),
        creative: creativeUrl,
        targetUrl,
        impressions: 0,
        clicks: 0,
        weight,
        effects,
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

export async function getCampaignDailyStats(campaignId: string, days = 30) {
  await requireAdmin();

  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  since.setHours(0, 0, 0, 0);

  const events = await prisma.adEvent.findMany({
    where: { campaignId, createdAt: { gte: since } },
    select: { type: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  // Group by date string YYYY-MM-DD
  const byDay: Record<string, { impressions: number; clicks: number }> = {};

  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    byDay[key] = { impressions: 0, clicks: 0 };
  }

  for (const ev of events) {
    const key = ev.createdAt.toISOString().slice(0, 10);
    if (!byDay[key]) byDay[key] = { impressions: 0, clicks: 0 };
    if (ev.type === 'impression') byDay[key].impressions++;
    else if (ev.type === 'click') byDay[key].clicks++;
  }

  return Object.entries(byDay).map(([date, counts]) => ({ date, ...counts }));
}

export async function getAllCampaignsDailyStats(days = 30) {
  await requireAdmin();

  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  since.setHours(0, 0, 0, 0);

  const events = await prisma.adEvent.findMany({
    where: { createdAt: { gte: since } },
    select: { type: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const byDay: Record<string, { impressions: number; clicks: number }> = {};

  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    byDay[key] = { impressions: 0, clicks: 0 };
  }

  for (const ev of events) {
    const key = ev.createdAt.toISOString().slice(0, 10);
    if (!byDay[key]) byDay[key] = { impressions: 0, clicks: 0 };
    if (ev.type === 'impression') byDay[key].impressions++;
    else if (ev.type === 'click') byDay[key].clicks++;
  }

  return Object.entries(byDay).map(([date, counts]) => ({ date, ...counts }));
}

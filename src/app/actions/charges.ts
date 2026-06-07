"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import Anthropic from "@anthropic-ai/sdk";

// ── Queries ──────────────────────────────────────────────────────────────────

export async function getActiveCharge() {
  return prisma.charge.findFirst({
    where: { isActive: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getCharges() {
  await requireAdmin();
  return prisma.charge.findMany({
    orderBy: { publishedAt: "desc" },
    take: 50,
  });
}

export async function getPublicCharges() {
  return prisma.charge.findMany({
    where: { isActive: true },
    orderBy: { publishedAt: "desc" },
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export async function createCharge(formData: FormData) {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF", "SECTION_EDITOR"]);

  const file = formData.get("image") as File | null;
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const credit = String(formData.get("credit") ?? "").trim() || null;
  const articleId = String(formData.get("articleId") ?? "").trim() || null;
  const publishedAt = formData.get("publishedAt")
    ? new Date(String(formData.get("publishedAt")))
    : new Date();

  if (!file || file.size === 0) {
    return { success: false, error: "Selecione uma imagem." };
  }

  const { uploadImage } = await import("@/lib/storage");
  const imageUrl = await uploadImage(file, "charges");

  const charge = await prisma.charge.create({
    data: { imageUrl, caption, credit, articleId, publishedAt },
  });

  revalidatePath("/");
  revalidatePath("/charges");
  revalidatePath("/admin/charges");
  return { success: true, charge };
}

export async function updateCharge(id: string, formData: FormData) {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF", "SECTION_EDITOR"]);

  const caption = String(formData.get("caption") ?? "").trim() || null;
  const credit = String(formData.get("credit") ?? "").trim() || null;
  const isActive = formData.get("isActive") === "true";
  const articleId = String(formData.get("articleId") ?? "").trim() || null;

  await prisma.charge.update({
    where: { id },
    data: { caption, credit, isActive, articleId },
  });

  revalidatePath("/");
  revalidatePath("/charges");
  revalidatePath("/admin/charges");
  return { success: true };
}

export async function deleteCharge(id: string) {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF"]);
  await prisma.charge.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/charges");
  revalidatePath("/admin/charges");
  return { success: true };
}

export async function toggleChargeActive(id: string, isActive: boolean) {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF", "SECTION_EDITOR"]);
  await prisma.charge.update({ where: { id }, data: { isActive } });
  revalidatePath("/");
  revalidatePath("/charges");
  revalidatePath("/admin/charges");
  return { success: true };
}

// ── Geração IA ────────────────────────────────────────────────────────────────

export async function generateChargeFromArticle(articleId: string) {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF", "SECTION_EDITOR"]);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { title: true, lead: true, eyebrow: true, section: { select: { name: true } } },
  });

  if (!article) return { success: false, error: "Matéria não encontrada." };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { success: false, error: "ANTHROPIC_API_KEY não configurada." };

  const client = new Anthropic({ apiKey });

  const prompt = `Você é um chargista político brasileiro experiente.
Com base na matéria jornalística abaixo, crie uma descrição detalhada de uma charge editorial.

Matéria: "${article.title}"
Editoria: ${article.section?.name || "Geral"}
Linha: ${article.lead || ""}

Descreva a charge com:
1. Cena principal: o que está acontecendo, personagens (genéricos, sem representar pessoas reais pelo nome), elementos visuais
2. Balão de fala ou legenda irônica (máximo 2 linhas)
3. Estilo sugerido: traço simples e expressivo, preto e branco com 1 cor de destaque

Seja criativo, irônico e pertinente. Responda em português.`;

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  const description = (message.content[0] as { type: string; text: string }).text;

  return {
    success: true,
    description,
    articleTitle: article.title,
  };
}

export async function searchArticlesForCharge(query: string) {
  await requireAdmin();
  if (!query.trim()) return [];

  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { eyebrow: { contains: query, mode: "insensitive" } },
      ],
    },
    select: { id: true, title: true, slug: true, publishedAt: true },
    orderBy: { publishedAt: "desc" },
    take: 8,
  });
}

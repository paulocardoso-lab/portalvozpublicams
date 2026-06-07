"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import Anthropic from "@anthropic-ai/sdk";

export const VOICE_TAGS = [
  "Bastidores",
  "Poder",
  "Economia",
  "Justica",
  "Agro",
  "Politica",
  "Saude",
  "Educacao",
  "Seguranca",
  "Meio Ambiente",
] as const;

export type VoiceTag = (typeof VOICE_TAGS)[number];

// ── Queries ──────────────────────────────────────────────────────────────────

export async function getActiveVoices(take = 6) {
  return prisma.voice.findMany({
    where: { isActive: true },
    orderBy: { publishedAt: "desc" },
    take,
  });
}

export async function getPublicVoices(tag?: string, take = 40) {
  return prisma.voice.findMany({
    where: { isActive: true, ...(tag ? { tag } : {}) },
    orderBy: { publishedAt: "desc" },
    take,
  });
}

export async function getAdminVoices() {
  await requireAdmin();
  return prisma.voice.findMany({
    orderBy: { publishedAt: "desc" },
    take: 100,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export async function createVoice(formData: FormData) {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF", "SECTION_EDITOR"]);

  const text = String(formData.get("text") ?? "").trim();
  const tag = String(formData.get("tag") ?? "Bastidores").trim();
  const location = String(formData.get("location") ?? "").trim() || null;
  const publishedAt = formData.get("publishedAt")
    ? new Date(String(formData.get("publishedAt")))
    : new Date();

  if (!text || text.length > 320) {
    return { success: false, error: "Texto obrigatorio e com no maximo 320 caracteres." };
  }

  const voice = await prisma.voice.create({
    data: { text, tag, location, publishedAt },
  });

  revalidatePath("/");
  revalidatePath("/vozes");
  revalidatePath("/admin/vozes");
  return { success: true, voice };
}

export async function updateVoice(id: string, formData: FormData) {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF", "SECTION_EDITOR"]);

  const text = String(formData.get("text") ?? "").trim();
  const tag = String(formData.get("tag") ?? "Bastidores").trim();
  const location = String(formData.get("location") ?? "").trim() || null;
  const isActive = formData.get("isActive") === "true";

  if (!text || text.length > 320) {
    return { success: false, error: "Texto invalido." };
  }

  await prisma.voice.update({ where: { id }, data: { text, tag, location, isActive } });

  revalidatePath("/");
  revalidatePath("/vozes");
  revalidatePath("/admin/vozes");
  return { success: true };
}

export async function deleteVoice(id: string) {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF"]);
  await prisma.voice.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/vozes");
  revalidatePath("/admin/vozes");
  return { success: true };
}

export async function toggleVoiceActive(id: string, isActive: boolean) {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF", "SECTION_EDITOR"]);
  await prisma.voice.update({ where: { id }, data: { isActive } });
  revalidatePath("/");
  revalidatePath("/vozes");
  revalidatePath("/admin/vozes");
  return { success: true };
}

// ── Geracao IA ────────────────────────────────────────────────────────────────

export async function generateVoicesFromPrompt(prompt: string) {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF", "SECTION_EDITOR"]);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { success: false, error: "ANTHROPIC_API_KEY nao configurada." };

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `Voce e um editor de jornalismo investigativo brasileiro especializado em bastidores do poder politico.

Com base no tema ou materia abaixo, crie exatamente 3 "Vozes" — fragmentos editoriais curtos, enigmaticos, que sugerem sem revelar. Sao como rumores qualificados, observacoes cifradas de bastidores. Cada voz deve ter no maximo 240 caracteres.

Estilo: Terceira pessoa impessoal. Sem autoria. Sem explicacoes. Sem hashtags. Deve soar como algo que um insider sussurrou, nao como uma manchete. Pode ser perturbador, misterioso, ironico.

Tema/Materia: "${prompt}"

Responda APENAS com as 3 vozes, uma por linha, sem numeracao, sem aspas, sem introducao.`,
      },
    ],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  const voices = raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 10 && l.length <= 320)
    .slice(0, 3);

  return { success: true, voices };
}

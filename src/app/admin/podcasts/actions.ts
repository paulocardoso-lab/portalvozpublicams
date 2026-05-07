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

export async function createPodcastEpisode(formData: FormData) {
  await requireAdmin();
  await prisma.podcastEpisode.create({
    data: {
      title: String(formData.get("title")),
      description: String(formData.get("description") ?? ""),
      embedUrl: String(formData.get("embedUrl") ?? ""),
      audioUrl: String(formData.get("audioUrl") ?? ""),
      duration: String(formData.get("duration") ?? ""),
      isActive: formData.get("isActive") === "on",
    },
  });
  await logAudit("PODCAST_CREATED", String(formData.get("title")), "OK");
  revalidatePath("/admin/podcasts");
}

export async function togglePodcastActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.podcastEpisode.update({ where: { id }, data: { isActive } });
  await logAudit(`PODCAST_TOGGLED → ${isActive}`, `podcast:${id}`, "OK");
  revalidatePath("/admin/podcasts");
}

export async function deletePodcastEpisode(id: string) {
  await requireAdmin();
  await prisma.podcastEpisode.delete({ where: { id } });
  await logAudit("PODCAST_DELETED", `podcast:${id}`, "OK");
  revalidatePath("/admin/podcasts");
}

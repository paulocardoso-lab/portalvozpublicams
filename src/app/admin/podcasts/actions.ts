"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPodcastEpisode(formData: FormData) {
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
  revalidatePath("/admin/podcasts");
}

export async function togglePodcastActive(id: string, isActive: boolean) {
  await prisma.podcastEpisode.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/podcasts");
}

export async function deletePodcastEpisode(id: string) {
  await prisma.podcastEpisode.delete({ where: { id } });
  revalidatePath("/admin/podcasts");
}

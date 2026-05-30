"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { requireAdmin } from "@/lib/auth-guard";
import { ArticleStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function logAudit(action: string, target: string, status: string, details?: Record<string, string>) {
  const session = await auth();
  await prisma.auditLog.create({
    data: {
      userId: session?.user?.id ?? null,
      action,
      target,
      status,
      details: details ?? undefined,
      ip: null,
    },
  });
}

export async function updateArticlePipelineStatus(articleId: string, status: ArticleStatus) {
  await requireAdmin();
  if (!Object.values(ArticleStatus).includes(status)) {
    return { success: false, error: "Status editorial inválido." };
  }

  const data: { status: ArticleStatus; publishedAt?: Date | null; scheduledAt?: Date | null } = { status };
  if (status === "PUBLISHED") data.publishedAt = new Date();
  if (status !== "SCHEDULED") data.scheduledAt = null;

  const article = await prisma.article.update({
    where: { id: articleId },
    data,
    select: { id: true, slug: true },
  });

  await logAudit("ARTICLE_PIPELINE_STATUS_UPDATED", `article:${article.id}`, "OK", { status });
  revalidatePath("/admin/kanban");
  revalidatePath("/admin/posts");
  revalidatePath(`/materia/${article.slug}`);
  return { success: true };
}

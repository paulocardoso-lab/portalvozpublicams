"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { CommentStatus } from "@prisma/client";

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

export async function updateCommentStatus(commentId: string, status: CommentStatus) {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF", "MODERATOR"]);
  if (!Object.values(CommentStatus).includes(status)) {
    throw new Error("Status de comentário inválido.");
  }

  const comment = await prisma.comment.update({
    where: { id: commentId },
    data: { status },
    select: { id: true, article: { select: { slug: true } } },
  });

  await logAudit("COMMENT_STATUS_UPDATED", `comment:${comment.id}`, "OK", { status });
  revalidatePath("/admin/comments");
  revalidatePath(`/materia/${comment.article.slug}`);
}

export async function deleteComment(commentId: string) {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF", "MODERATOR"]);

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, article: { select: { slug: true } } },
  });
  if (!comment) throw new Error("Comentário não encontrado.");

  await prisma.$transaction([
    prisma.comment.deleteMany({ where: { parentId: commentId } }),
    prisma.comment.delete({ where: { id: commentId } }),
  ]);
  await logAudit("COMMENT_DELETED", `comment:${commentId}`, "OK");
  revalidatePath("/admin/comments");
  revalidatePath(`/materia/${comment.article.slug}`);
}

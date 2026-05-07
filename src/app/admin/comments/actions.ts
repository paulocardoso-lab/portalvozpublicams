"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";

type CommentStatus = "PENDING" | "APPROVED" | "HIDDEN" | "SPAM" | "BANNED";

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

export async function updateCommentStatus(id: string, status: CommentStatus, _formData?: FormData) {
  await requireAdmin();
  await prisma.comment.update({ where: { id }, data: { status } });
  await logAudit(`COMMENT_STATUS_CHANGED → ${status}`, `comment:${id}`, "OK");
  revalidatePath("/admin/comments");
}

export async function deleteComment(id: string, _formData?: FormData) {
  await requireAdmin();
  await prisma.comment.delete({ where: { id } });
  await logAudit("COMMENT_DELETED", `comment:${id}`, "OK");
  revalidatePath("/admin/comments");
}

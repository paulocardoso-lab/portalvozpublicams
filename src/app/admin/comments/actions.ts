"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type CommentStatus = "PENDING" | "APPROVED" | "HIDDEN" | "SPAM" | "BANNED";

export async function updateCommentStatus(id: string, status: CommentStatus) {
  await prisma.comment.update({ where: { id }, data: { status } });
  revalidatePath("/admin/comments");
}

export async function deleteComment(id: string) {
  await prisma.comment.delete({ where: { id } });
  revalidatePath("/admin/comments");
}

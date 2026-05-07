"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { requireAdmin, requireSuperAdmin } from "@/lib/auth-guard";

type Role = "SUPER_ADMIN" | "EDITOR_CHIEF" | "SECTION_EDITOR" | "REPORTER" | "COLUMNIST" | "MODERATOR" | "FINANCE" | "READER";
type UserStatus = "ACTIVE" | "BANNED" | "DELETED";

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

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: String(formData.get("name")),
      bio: String(formData.get("bio") ?? ""),
      city: String(formData.get("city") ?? ""),
    },
  });
  await logAudit("PROFILE_UPDATED", `user:${session.user.id}`, "OK");
  revalidatePath("/admin/profile");
}

export async function updateUserRole(userId: string, role: Role) {
  await requireSuperAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  await logAudit(`USER_ROLE_CHANGED → ${role}`, `user:${userId}`, "OK");
  revalidatePath("/admin/users");
}

export async function updateUserStatus(userId: string, status: UserStatus) {
  await requireSuperAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { status },
  });
  await logAudit(`USER_STATUS_CHANGED → ${status}`, `user:${userId}`, "OK");
  revalidatePath("/admin/users");
}

export async function getUsers(search?: string) {
  const users = await prisma.user.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      _count: { select: { articles: true, sessions: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return users;
}

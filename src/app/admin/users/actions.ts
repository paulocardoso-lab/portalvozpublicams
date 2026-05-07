"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

type Role = "SUPER_ADMIN" | "EDITOR_CHIEF" | "SECTION_EDITOR" | "REPORTER" | "COLUMNIST" | "MODERATOR" | "FINANCE" | "READER";
type UserStatus = "ACTIVE" | "BANNED" | "DELETED";

async function assertSuperAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "SUPER_ADMIN" && role !== "EDITOR_CHIEF") {
    throw new Error("Sem permissão.");
  }
}

export async function updateUserRole(userId: string, role: Role) {
  await assertSuperAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/admin/users");
}

export async function updateUserStatus(userId: string, status: UserStatus) {
  await assertSuperAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { status },
  });
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

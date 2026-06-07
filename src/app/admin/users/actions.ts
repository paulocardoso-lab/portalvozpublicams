"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { requireAdmin, requireSuperAdmin } from "@/lib/auth-guard";
import { z } from "zod";

type Role = "SUPER_ADMIN" | "EDITOR_CHIEF" | "SECTION_EDITOR" | "REPORTER" | "COLUMNIST" | "MODERATOR" | "FINANCE" | "READER";
type UserStatus = "ACTIVE" | "BANNED" | "DELETED";

const createUserSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do usuário."),
  email: z.string().trim().email("Informe um e-mail válido.").toLowerCase(),
  role: z.enum(["SUPER_ADMIN", "EDITOR_CHIEF", "SECTION_EDITOR", "REPORTER", "COLUMNIST", "MODERATOR", "FINANCE", "READER"]),
  password: z.string().min(8, "A senha temporária precisa ter pelo menos 8 caracteres."),
});

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
  const admin = await requireSuperAdmin();
  if (userId === admin.id && role !== admin.role) {
    return { success: false, error: "Você não pode alterar o seu próprio papel." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  await logAudit(`USER_ROLE_CHANGED → ${role}`, `user:${userId}`, "OK");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserStatus(userId: string, status: UserStatus) {
  const admin = await requireSuperAdmin();
  if (userId === admin.id) {
    return { success: false, error: "Você não pode suspender a própria conta." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { status },
  });
  await logAudit(`USER_STATUS_CHANGED → ${status}`, `user:${userId}`, "OK");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const admin = await requireAdmin(["SUPER_ADMIN"]);
  if (userId === admin.id) {
    return { success: false, error: "Você não pode excluir a própria conta." };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, status: true },
  });

  if (!target) {
    return { success: false, error: "Usuário não encontrado." };
  }

  if (target.status === "DELETED") {
    return { success: true };
  }

  if (target.role === "SUPER_ADMIN") {
    const activeSuperAdmins = await prisma.user.count({
      where: { role: "SUPER_ADMIN", status: "ACTIVE" },
    });

    if (activeSuperAdmins <= 1) {
      return { success: false, error: "Não é possível excluir o último Super Admin ativo." };
    }
  }

  await prisma.$transaction([
    prisma.session.deleteMany({ where: { userId } }),
    prisma.account.deleteMany({ where: { userId } }),
    prisma.user.update({
      where: { id: userId },
      data: { status: "DELETED" },
    }),
  ]);

  await logAudit("USER_DELETED", `user:${userId}`, "OK");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function createUser(formData: FormData) {
  await requireSuperAdmin();

  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const { name, email, role, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        passwordHash,
        status: "ACTIVE",
      },
      select: { id: true, email: true },
    });

    await logAudit("USER_CREATED", `user:${user.id}`, "OK");
    revalidatePath("/admin/users");
    return { success: true, message: `Usuário ${user.email} criado com acesso ativo.` };
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return { success: false, error: "Já existe um usuário com este e-mail." };
    }

    console.error("createUser failed:", error);
    return { success: false, error: "Não foi possível criar o usuário." };
  }
}

export async function getUsers(search?: string) {
  await requireAdmin();

  const users = await prisma.user.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      _count: { select: { articles: true, sessions: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return users;
}

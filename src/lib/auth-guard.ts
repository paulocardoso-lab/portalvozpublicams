import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

/**
 * Roles that are allowed to access the admin panel.
 * READER is explicitly excluded.
 */
const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "EDITOR_CHIEF",
  "SECTION_EDITOR",
  "REPORTER",
  "COLUMNIST",
  "MODERATOR",
  "FINANCE",
] satisfies Exclude<Role, "READER">[];

export type AdminRole = (typeof ADMIN_ROLES)[number];

export function isAdminRole(role: string | undefined | null): role is AdminRole {
  return ADMIN_ROLES.includes(role as AdminRole);
}

/**
 * Use in Server Actions and Server Components to enforce authentication + role.
 * Throws an error (which Next.js surfaces as a 403-like response) if the user
 * is not authenticated or does not have an admin role.
 *
 * @param allowedRoles - If provided, only these specific roles are allowed.
 *                       Defaults to all admin roles.
 */
export async function requireAdmin(
  allowedRoles: AdminRole[] = [...ADMIN_ROLES]
): Promise<{ id: string; email: string; role: AdminRole }> {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const role = (session.user as { role?: string }).role;

  if (!role || !allowedRoles.includes(role as AdminRole)) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, role: true, status: true },
  });

  if (!user || user.status !== "ACTIVE" || !allowedRoles.includes(user.role as AdminRole)) {
    redirect("/login");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role as AdminRole,
  };
}

/**
 * Lightweight check: only SUPER_ADMIN and EDITOR_CHIEF can perform
 * destructive operations (delete users, change roles, manage settings).
 */
export async function requireSuperAdmin() {
  return requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF"]);
}

import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Roles that are allowed to access the admin panel.
 * READER is explicitly excluded.
 */
const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR_CHIEF",
  "SECTION_EDITOR",
  "REPORTER",
  "COLUMNIST",
  "MODERATOR",
  "FINANCE",
] as const;

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
    throw new Error(
      `Acesso negado. Papel necessário: ${allowedRoles.join(" | ")}. Papel atual: ${role ?? "READER"}`
    );
  }

  return {
    id: (session.user as { id?: string }).id ?? "",
    email: session.user.email,
    role: role as AdminRole,
  };
}

/**
 * Lightweight check: only SUPER_ADMIN and EDITOR_CHIEF can perform
 * destructive operations (delete users, change roles, manage settings).
 */
export async function requireSuperAdmin() {
  return requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF"]);
}

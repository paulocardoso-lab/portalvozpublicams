import React from "react";
import { getUsers } from "./actions";
import { UsersClient } from "./UsersClient";
import { auth } from "@/auth";
import type { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [users, session] = await Promise.all([getUsers(), auth()]);
  const currentUserId = session?.user?.id ?? "";
  const currentUserRole = ((session?.user as { role?: Role } | undefined)?.role ?? "") as Role | "";

  return <UsersClient users={users} currentUserId={currentUserId} currentUserRole={currentUserRole} />;
}

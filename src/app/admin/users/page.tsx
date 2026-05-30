import React from "react";
import { getUsers } from "./actions";
import { UsersClient } from "./UsersClient";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [users, session] = await Promise.all([getUsers(), auth()]);
  const currentUserId = session?.user?.id ?? "";

  return <UsersClient users={users} currentUserId={currentUserId} />;
}

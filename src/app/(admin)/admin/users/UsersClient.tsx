"use client";

import React, { useTransition } from "react";
import { updateUserRole, updateUserStatus } from "./actions";

type Role = "SUPER_ADMIN" | "EDITOR_CHIEF" | "SECTION_EDITOR" | "REPORTER" | "COLUMNIST" | "MODERATOR" | "FINANCE" | "READER";
type UserStatus = "ACTIVE" | "BANNED" | "DELETED";

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  EDITOR_CHIEF: "Editor-chefe",
  SECTION_EDITOR: "Editor de Editoria",
  REPORTER: "Repórter",
  COLUMNIST: "Colunista",
  MODERATOR: "Moderador",
  FINANCE: "Financeiro",
  READER: "Leitor",
};

const ROLE_COLORS: Record<Role, string> = {
  SUPER_ADMIN: "text-[#e05c5c]",
  EDITOR_CHIEF: "text-[#e0944a]",
  SECTION_EDITOR: "text-[#e0cb4a]",
  REPORTER: "text-[#5cb8e0]",
  COLUMNIST: "text-[#a45ce0]",
  MODERATOR: "text-[#5ce09e]",
  FINANCE: "text-[#5c8ae0]",
  READER: "text-vp-text-3",
};

type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  avatar: string | null;
  role: Role;
  status: UserStatus;
  createdAt: Date;
  _count: { articles: number; sessions: number };
};

function RoleSelect({ userId, currentRole }: { userId: string; currentRole: Role }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticRole, setOptimisticRole] = React.useState(currentRole);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
    setOptimisticRole(newRole);
    startTransition(async () => {
      await updateUserRole(userId, newRole);
    });
  };

  return (
    <select
      value={optimisticRole}
      onChange={handleChange}
      disabled={isPending}
      className={`bg-vp-surface border border-vp-border rounded px-2 py-1 text-[12px] font-semibold ${ROLE_COLORS[optimisticRole]} disabled:opacity-50 cursor-pointer`}
    >
      {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
        <option key={r} value={r} className="text-vp-text bg-vp-bg">
          {ROLE_LABELS[r]}
        </option>
      ))}
    </select>
  );
}

function StatusToggle({ userId, currentStatus, isSelf }: { userId: string; currentStatus: UserStatus; isSelf: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = React.useState(currentStatus);

  const toggle = () => {
    if (isSelf) return;
    const newStatus: UserStatus = status === "ACTIVE" ? "BANNED" : "ACTIVE";
    setStatus(newStatus);
    startTransition(async () => {
      await updateUserStatus(userId, newStatus);
    });
  };

  if (isSelf) {
    return <span className="text-[11px] text-vp-text-3 italic">você</span>;
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`text-[11px] font-semibold disabled:opacity-50 hover:underline ${status === "ACTIVE" ? "text-vp-urgent" : "text-vp-ok"}`}
    >
      {isPending ? "..." : status === "ACTIVE" ? "Suspender" : "Reativar"}
    </button>
  );
}

export function UsersClient({ users, currentUserId }: { users: User[]; currentUserId: string }) {
  const [search, setSearch] = React.useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = users.filter((u) => u.status === "ACTIVE").length;
  const bannedCount = users.filter((u) => u.status === "BANNED").length;

  return (
    <div className="max-w-[1200px]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
        <div>
          <h1 className="text-[22px] font-semibold mb-1">Usuários & permissões</h1>
          <p className="text-vp-text-3 text-[13px]">
            {users.length} usuários · {activeCount} ativos · {bannedCount} suspensos
          </p>
        </div>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 mb-5">
        {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([role, label]) => (
          <div key={role} className="bg-[#141413] border border-vp-border p-2.5 rounded flex items-center gap-2">
            <span className={`text-[8px] ${ROLE_COLORS[role]}`}>●</span>
            <span className="text-[11px] font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          className="vp-input w-full max-w-[400px] text-[13px]"
          placeholder="Buscar por nome ou e-mail…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-[#141413] border border-vp-border overflow-x-auto rounded">
        <div className="min-w-[760px]">
          {/* Header */}
          <div className="grid grid-cols-[2fr_1.2fr_1fr_0.6fr_0.8fr] px-5 py-3 border-b border-vp-border text-[11px] uppercase tracking-[0.1em] text-vp-text-3">
            <span>Usuário</span>
            <span>Papel</span>
            <span>Status</span>
            <span>Matérias</span>
            <span className="text-right">Ações</span>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-vp-text-3 text-[13px]">
              Nenhum usuário encontrado.
            </div>
          ) : (
            filtered.map((u, i) => (
              <div
                key={u.id}
                className={`grid grid-cols-[2fr_1.2fr_1fr_0.6fr_0.8fr] px-5 py-3.5 items-center text-[13px] ${
                  i < filtered.length - 1 ? "border-b border-vp-border" : ""
                } ${u.status === "BANNED" ? "opacity-50" : ""}`}
              >
                {/* Name + email */}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-full bg-vp-surface-2 border border-vp-border flex items-center justify-center shrink-0 text-[12px] font-bold text-vp-accent uppercase">
                    {u.image || u.avatar ? (
                      <img src={u.image || u.avatar || ""} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      u.name.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate text-[13px]">{u.name}</div>
                    <div className="text-[11px] text-vp-text-3 truncate">{u.email}</div>
                  </div>
                </div>

                {/* Role select */}
                <div>
                  <RoleSelect userId={u.id} currentRole={u.role as Role} />
                </div>

                {/* Status badge */}
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        u.status === "ACTIVE" ? "bg-vp-ok" : u.status === "BANNED" ? "bg-vp-urgent" : "bg-vp-text-4"
                      }`}
                    />
                    {u.status === "ACTIVE" ? "Ativo" : u.status === "BANNED" ? "Suspenso" : "Excluído"}
                  </span>
                </div>

                {/* Article count */}
                <span className="font-mono text-vp-text-2 text-[12px]">{u._count.articles}</span>

                {/* Actions */}
                <div className="text-right">
                  <StatusToggle userId={u.id} currentStatus={u.status as UserStatus} isSelf={u.id === currentUserId} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <p className="mt-3 text-[11px] text-vp-text-3">
        Mostrando {filtered.length} de {users.length} usuários · Alterações de papel são aplicadas imediatamente.
      </p>
    </div>
  );
}

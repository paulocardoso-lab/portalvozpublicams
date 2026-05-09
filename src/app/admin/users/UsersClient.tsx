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
      title="Alterar papel do usuário"
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
    return <span className="text-[11px] text-vp-text-4 italic font-serif">você</span>;
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`text-[11px] font-black uppercase tracking-widest disabled:opacity-50 hover:underline ${status === "ACTIVE" ? "text-vp-urgent" : "text-vp-ok"}`}
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[32px] lg:text-[42px] font-black leading-tight text-vp-text">
            Usuários & Permissões.
          </h1>
          <p className="font-serif italic text-[16px] text-vp-text-3 mt-2">
            Gerencie o acesso da redação · {users.length} usuários · {activeCount} ativos · {bannedCount} suspensos
          </p>
        </div>
        <div className="flex gap-3">
          <button className="vp-btn text-[12px] font-bold uppercase tracking-widest py-2.5 px-6">
             Logs de Acesso
          </button>
          <button className="vp-btn vp-btn-primary text-[12px] font-bold uppercase tracking-widest py-2.5 px-8">
             + Convidar Membro
          </button>
        </div>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
        {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([role, label]) => (
          <div key={role} className="bg-[#141413] border border-vp-border p-2.5 rounded-sm flex items-center gap-2">
            <span className={`text-[8px] ${ROLE_COLORS[role]}`}>●</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </div>

      {/* Search & List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative group w-full max-w-[400px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-vp-text-4 font-mono">/</span>
            <input
              className="vp-input w-full pl-8 py-2.5 text-[13px] bg-[#0e0e0d] border-vp-border"
              placeholder="Filtrar por nome ou e-mail…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="vp-panel overflow-hidden bg-[#141413] border border-vp-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-vp-border bg-[#0e0e0d]">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4">Membro da Redação</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4">Papel / Acesso</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-center">Matérias</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vp-border/30">
                {filtered.map((u) => (
                  <tr key={u.id} className={`hover:bg-vp-surface/30 transition-colors group ${u.status === "BANNED" ? "opacity-50" : ""}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-vp-surface border border-vp-border flex items-center justify-center font-black text-vp-accent text-[14px]">
                          {u.image || u.avatar ? (
                            <img src={u.image || u.avatar || ""} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            u.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <h4 className="text-[14px] font-bold text-vp-text">{u.name}</h4>
                          <span className="text-[11px] text-vp-text-4 font-mono">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <RoleSelect userId={u.id} currentRole={u.role as Role} />
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          u.status === "ACTIVE" ? "bg-vp-ok" : u.status === "BANNED" ? "bg-vp-urgent" : "bg-vp-text-4"
                        }`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                           {u.status === "ACTIVE" ? "Ativo" : u.status === "BANNED" ? "Suspenso" : "Excluído"}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center font-mono text-[13px] text-vp-text-2">
                      {u._count.articles}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <StatusToggle userId={u.id} currentStatus={u.status as UserStatus} isSelf={u.id === currentUserId} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createUser, deleteUser, updateColumnistInfo, updateUserAvatar, updateUserRole, updateUserStatus } from "./actions";
import { SafeImage } from "@/components/shared/SafeImage";

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
  slug: string | null;
  bio: string | null;
  image: string | null;
  avatar: string | null;
  role: Role;
  status: UserStatus;
  columnTitle: string | null;
  displayOrder: number;
  createdAt: Date;
  _count: { articles: number; sessions: number };
};

function RoleSelect({ userId, currentRole, disabled = false }: { userId: string; currentRole: Role; disabled?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticRole, setOptimisticRole] = React.useState(currentRole);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
    const previousRole = optimisticRole;
    setOptimisticRole(newRole);
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (!result.success) {
        setOptimisticRole(previousRole);
        alert(result.error);
      }
    });
  };

  return (
    <select
      value={optimisticRole}
      onChange={handleChange}
      disabled={isPending || disabled}
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
    const previousStatus = status;
    setStatus(newStatus);
    startTransition(async () => {
      const result = await updateUserStatus(userId, newStatus);
      if (!result.success) {
        setStatus(previousStatus);
        alert(result.error);
      }
    });
  };

  if (isSelf) {
    return <span className="text-[11px] text-vp-text-4 italic font-serif">você</span>;
  }

  if (status === "DELETED") {
    return <span className="text-[11px] font-black uppercase tracking-widest text-vp-text-4">Excluído</span>;
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

function AvatarUploader({ userId, name, currentAvatar, canEdit }: {
  userId: string;
  name: string;
  currentAvatar: string | null;
  canEdit: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [avatar, setAvatar] = React.useState(currentAvatar);
  const [error, setError] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setError(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    setError(null);
    startTransition(async () => {
      const result = await updateUserAvatar(userId, fd);
      if (!result.success) {
        setError(result.error ?? "Erro ao salvar.");
        return;
      }
      if (result.avatarUrl) setAvatar(result.avatarUrl);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setOpen(false);
    });
  }

  function handleClose() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
    setOpen(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  const displaySrc = preview ?? avatar ?? null;

  return (
    <>
      <div
        className={`relative w-10 h-10 rounded-full overflow-hidden bg-vp-surface border border-vp-border flex items-center justify-center font-black text-vp-accent text-[14px] ${canEdit ? "cursor-pointer group/av" : ""}`}
        onClick={() => canEdit && setOpen(true)}
        title={canEdit ? "Alterar foto" : undefined}
      >
        {displaySrc ? (
          <SafeImage src={displaySrc} alt="" fill sizes="40px" className="object-cover" />
        ) : (
          name.charAt(0)
        )}
        {canEdit && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/av:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-[9px] font-black uppercase tracking-widest leading-tight text-center">editar</span>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={handleClose}>
          <div className="w-full max-w-[400px] border border-vp-border bg-[#141413] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="font-display text-[18px] font-bold">Foto de {name}</h2>
                <p className="text-[11px] text-vp-text-3 mt-1">Aparecerá ao lado do nome nas matérias.</p>
              </div>
              <button type="button" onClick={handleClose} className="text-vp-text-3 hover:text-vp-text" title="Fechar">✕</button>
            </div>

            <div className="flex justify-center mb-5">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-vp-surface border border-vp-border flex items-center justify-center font-black text-vp-accent text-[32px]">
                {displaySrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={displaySrc} alt="" className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0)
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <label className="grid gap-1.5">
                <span className="eyebrow text-[10px]">Selecionar imagem</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="vp-input text-[12px] pt-1.5 cursor-pointer"
                  onChange={handleFileChange}
                  required
                />
                <span className="text-[10px] text-vp-text-4">JPG, PNG ou WebP · máx. 5 MB · será convertida para WebP</span>
              </label>

              {error && (
                <div className="border border-vp-urgent/40 bg-vp-urgent/10 text-vp-urgent px-3 py-2 text-[12px]">{error}</div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={handleClose} className="vp-btn flex-1 py-2.5">Cancelar</button>
                <button type="submit" disabled={isPending} className="vp-btn vp-btn-primary flex-1 py-2.5">
                  {isPending ? "Salvando..." : "Salvar foto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function ColumnistInfoModal({ user, onClose }: { user: User; onClose: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateColumnistInfo(user.id, fd);
      if (!result.success) {
        setError("Não foi possível salvar.");
        return;
      }
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-120 border border-vp-border bg-[#141413] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display text-[18px] font-bold">Dados da coluna · {user.name}</h2>
            <p className="text-[11px] text-vp-text-3 mt-1">Título da coluna, slug público e ordem na home.</p>
          </div>
          <button type="button" onClick={onClose} className="text-vp-text-3 hover:text-vp-text">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="eyebrow text-[10px]">Título da coluna</span>
            <input name="columnTitle" className="vp-input text-[13px]" defaultValue={user.columnTitle ?? ""} placeholder="Ex: Política em MS" />
            <span className="text-[10px] text-vp-text-4">Aparece no card da home e na página do colunista.</span>
          </label>

          <label className="grid gap-1.5">
            <span className="eyebrow text-[10px]">Slug (URL pública)</span>
            <input name="slug" className="vp-input text-[13px] font-mono" defaultValue={user.slug ?? ""} placeholder="ex: joao-silva" />
            <span className="text-[10px] text-vp-text-4">Será acessível em /colunista/[slug]</span>
          </label>

          <label className="grid gap-1.5">
            <span className="eyebrow text-[10px]">Bio</span>
            <textarea name="bio" className="vp-input text-[13px] resize-none" rows={3} defaultValue={user.bio ?? ""} placeholder="Breve descrição do colunista..." />
          </label>

          <label className="grid gap-1.5">
            <span className="eyebrow text-[10px]">Ordem na home (menor = primeiro)</span>
            <input name="displayOrder" type="number" min={0} max={99} className="vp-input text-[13px] w-24" defaultValue={user.displayOrder} />
          </label>

          {error && <div className="border border-vp-urgent/40 bg-vp-urgent/10 text-vp-urgent px-3 py-2 text-[12px]">{error}</div>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="vp-btn flex-1 py-2.5">Cancelar</button>
            <button type="submit" disabled={isPending} className="vp-btn vp-btn-primary flex-1 py-2.5">
              {isPending ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(`Excluir o usuário "${userName}"? Esta ação remove o acesso e preserva o histórico editorial.`);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteUser(userId);
      if (!result.success) {
        alert(result.error ?? "Não foi possível excluir o usuário.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-[11px] font-black uppercase tracking-widest text-vp-urgent hover:underline disabled:opacity-50"
    >
      {isPending ? "Excluindo..." : "Excluir"}
    </button>
  );
}

function InviteUserModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await createUser(formData);
      if (!result.success) {
        setMessage({ type: "error", text: result.error ?? "Não foi possível criar o usuário." });
        return;
      }

      setMessage({ type: "success", text: result.message ?? "Usuário criado com sucesso." });
      router.refresh();
      window.setTimeout(onClose, 900);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] border border-vp-border bg-[#141413] p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-[20px] font-bold">Convidar membro</h2>
            <p className="mt-1 text-[12px] text-vp-text-3">
              Crie um acesso ativo com senha temporária para a redação.
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-vp-text-3 hover:text-vp-text" title="Fechar">
            ✕
          </button>
        </div>

        <form action={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="eyebrow text-[10px]">Nome</span>
            <input name="name" className="vp-input text-[13px]" required minLength={2} />
          </label>

          <label className="grid gap-1.5">
            <span className="eyebrow text-[10px]">E-mail</span>
            <input name="email" type="email" className="vp-input text-[13px]" required />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="eyebrow text-[10px]">Papel</span>
              <select name="role" className="vp-input text-[13px]" defaultValue="REPORTER" title="Papel inicial">
                {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([role, label]) => (
                  <option key={role} value={role}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="eyebrow text-[10px]">Senha temporária</span>
              <input name="password" type="password" className="vp-input text-[13px]" required minLength={8} />
            </label>
          </div>

          {message && (
            <div
              className={`border px-3 py-2 text-[12px] ${
                message.type === "success"
                  ? "border-vp-ok/40 bg-vp-ok/10 text-vp-ok"
                  : "border-vp-urgent/40 bg-vp-urgent/10 text-vp-urgent"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="vp-btn flex-1 py-2.5">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="vp-btn vp-btn-primary flex-1 py-2.5">
              {isPending ? "Criando..." : "Criar usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function UsersClient({
  users,
  currentUserId,
  currentUserRole,
}: {
  users: User[];
  currentUserId: string;
  currentUserRole: Role | "";
}) {
  const [search, setSearch] = React.useState("");
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  const [editingColumnist, setEditingColumnist] = React.useState<User | null>(null);

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
          <a href="/admin/audit" className="vp-btn text-[12px] font-bold uppercase tracking-widest py-2.5 px-6 no-underline">
             Logs de Acesso
          </a>
          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="vp-btn vp-btn-primary text-[12px] font-bold uppercase tracking-widest py-2.5 px-8"
          >
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
                  <tr key={u.id} className={`hover:bg-vp-surface/30 transition-colors group ${u.status !== "ACTIVE" ? "opacity-50" : ""}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <AvatarUploader
                          userId={u.id}
                          name={u.name}
                          currentAvatar={u.avatar || u.image}
                          canEdit={currentUserRole === "SUPER_ADMIN" || u.id === currentUserId}
                        />
                        <div>
                          <h4 className="text-[14px] font-bold text-vp-text">{u.name}</h4>
                          <span className="text-[11px] text-vp-text-4 font-mono">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <RoleSelect userId={u.id} currentRole={u.role as Role} disabled={u.status === "DELETED"} />
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
                      <div className="flex flex-col items-end gap-2">
                        <StatusToggle userId={u.id} currentStatus={u.status as UserStatus} isSelf={u.id === currentUserId} />
                        {(u.role === "COLUMNIST" || u.role === "REPORTER") && (currentUserRole === "SUPER_ADMIN" || u.id === currentUserId) && (
                          <button
                            type="button"
                            onClick={() => setEditingColumnist(u)}
                            className="text-[11px] font-black uppercase tracking-widest text-vp-accent hover:underline"
                          >
                            Editar coluna
                          </button>
                        )}
                        {currentUserRole === "SUPER_ADMIN" && u.id !== currentUserId && u.status !== "DELETED" && (
                          <DeleteUserButton userId={u.id} userName={u.name} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isInviteOpen && <InviteUserModal onClose={() => setIsInviteOpen(false)} />}
      {editingColumnist && <ColumnistInfoModal user={editingColumnist} onClose={() => setEditingColumnist(null)} />}
    </div>
  );
}

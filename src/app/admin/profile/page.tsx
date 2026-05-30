import React from "react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateProfile } from "./actions";
import { SafeImage } from "@/components/shared/SafeImage";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  EDITOR_CHIEF: "Editor-chefe",
  SECTION_EDITOR: "Editor de Editoria",
  REPORTER: "Repórter",
  COLUMNIST: "Colunista",
  MODERATOR: "Moderador",
  FINANCE: "Financeiro",
  READER: "Leitor",
};

export default async function AdminProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      bio: true,
      city: true,
      createdAt: true,
      _count: { select: { articles: true, comments: true } }
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-[700px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold mb-1">Meu Perfil</h1>
        <p className="text-vp-text-3 text-[13px]">Gerencie suas informações de conta.</p>
      </div>

      {/* Profile card */}
      <div className="bg-[#141413] border border-vp-border p-5 rounded mb-4 flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-vp-surface-2 border-2 border-vp-border flex items-center justify-center text-[24px] font-bold text-vp-accent shrink-0">
          {user.image ? (
            <SafeImage src={user.image} alt="" fill sizes="64px" className="object-cover" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <div className="text-[18px] font-bold">{user.name}</div>
          <div className="text-[13px] text-vp-text-3">{user.email}</div>
          <div className="text-[11px] text-vp-accent font-semibold uppercase tracking-wider mt-1">
            {ROLE_LABELS[user.role] ?? user.role}
          </div>
        </div>
        <div className="ml-auto text-right text-[12px] text-vp-text-3">
          <div><span className="font-mono font-bold text-vp-text">{user._count.articles}</span> matérias</div>
          <div className="mt-1"><span className="font-mono font-bold text-vp-text">{user._count.comments}</span> comentários</div>
          <div className="mt-1">Membro desde {user.createdAt.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-[#141413] border border-vp-border p-5 rounded">
        <h3 className="text-[13px] font-semibold mb-4 uppercase tracking-wider text-vp-text-3">Editar informações</h3>
        <form action={updateProfile} className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Nome completo</span>
            <input name="name" className="vp-input text-[13px]" defaultValue={user.name} required />
          </label>
          <label className="grid gap-1">
            <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Cidade</span>
            <input name="city" className="vp-input text-[13px]" defaultValue={user.city ?? ""} placeholder="Campo Grande, MS" />
          </label>
          <label className="grid gap-1">
            <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Bio</span>
            <textarea name="bio" className="vp-input text-[13px] h-24 resize-none" defaultValue={user.bio ?? ""} placeholder="Conte um pouco sobre você..." />
          </label>
          <div className="flex justify-end pt-1">
            <button type="submit" className="vp-btn vp-btn-primary px-6 py-2 text-[13px]">Salvar alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}

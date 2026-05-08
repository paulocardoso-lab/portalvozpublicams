import React from 'react';
import { prisma } from '@/lib/prisma';
import { createSection, deleteSection, updateSectionMenu } from '@/app/actions/section';

export const dynamic = 'force-dynamic';

export default async function AdminSectionsPage() {
  const sections = await prisma.section.findMany({
    orderBy: [{ showInMenu: 'desc' }, { menuOrder: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div className="max-w-[900px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold mb-1">Editorias</h1>
        <p className="text-vp-text-3 text-[13px]">
          {sections.length} editorias cadastradas · {sections.filter(s => s.showInMenu).length} no menu
        </p>
      </div>

      {/* Create form */}
      <div className="bg-[#141413] border border-vp-border p-5 rounded mb-6">
        <h3 className="text-[13px] font-semibold mb-4 uppercase tracking-wider text-vp-text-3">Nova Editoria</h3>
        <form action={createSection} className="grid gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Nome *</span>
              <input
                name="name"
                className="vp-input text-[13px]"
                placeholder="ex: Política"
                required
              />
            </label>
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Slug * (URL)</span>
              <input
                name="slug"
                className="vp-input text-[13px] font-mono"
                placeholder="ex: politica"
                pattern="[a-z0-9\-]+"
                title="Apenas letras minúsculas, números e hífens"
                required
              />
            </label>
          </div>
          <label className="grid gap-1">
            <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Descrição (opcional)</span>
            <input
              name="description"
              className="vp-input text-[13px]"
              placeholder="Cobertura do Executivo, Legislativo e Judiciário de MS"
            />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input name="showInMenu" type="checkbox" className="accent-vp-accent" />
              <span>Exibir no menu principal</span>
            </label>
            <label className="flex items-center gap-2 text-[13px]">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Ordem no menu:</span>
              <input
                name="menuOrder"
                type="number"
                defaultValue="0"
                min="0"
                className="vp-input text-[13px] w-20 font-mono"
              />
            </label>
            <button type="submit" className="vp-btn vp-btn-primary px-6 py-2 text-[13px] ml-auto">
              + Criar editoria
            </button>
          </div>
        </form>
      </div>

      {/* Sections table */}
      <div className="bg-[#141413] border border-vp-border rounded overflow-hidden">
        {sections.length === 0 ? (
          <div className="px-5 py-12 text-center text-vp-text-3 italic">
            Nenhuma editoria cadastrada. Use o formulário acima para criar a primeira.
          </div>
        ) : (
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-vp-border text-[10px] text-vp-text-3 uppercase tracking-wider">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3 text-center">No Menu</th>
                <th className="px-4 py-3 text-center">Ordem</th>
                <th className="px-4 py-3 text-center">Matérias</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vp-border">
              {sections.map((section) => (
                <tr key={section.id} className="hover:bg-vp-surface/30 transition-colors">
                  <td className="px-4 py-3 font-semibold">{section.name}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-vp-text-3">/{section.slug}</td>
                  <td className="px-4 py-3 text-center">
                    <form action={updateSectionMenu.bind(null, section.id, {
                      showInMenu: !section.showInMenu,
                      menuOrder: section.menuOrder,
                    })}>
                      <button
                        type="submit"
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border transition-all ${
                          section.showInMenu
                            ? 'bg-vp-ok/10 text-vp-ok border-vp-ok/30'
                            : 'bg-vp-text-3/10 text-vp-text-3 border-vp-text-3/30 hover:bg-vp-ok/10 hover:text-vp-ok hover:border-vp-ok/30'
                        }`}
                      >
                        {section.showInMenu ? '● Visível' : '○ Oculto'}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-[12px]">{section.menuOrder}</td>
                  <td className="px-4 py-3 text-center font-mono text-[12px]">{section._count.articles}</td>
                  <td className="px-4 py-3 text-right">
                    {section._count.articles === 0 ? (
                      <form action={deleteSection.bind(null, section.id)}>
                        <button type="submit" className="vp-btn text-[11px] py-1 px-2.5 text-vp-urgent border-vp-urgent hover:bg-vp-urgent/10">
                          Excluir
                        </button>
                      </form>
                    ) : (
                      <span className="text-[11px] text-vp-text-4 italic">
                        {section._count.articles} matéria(s)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-3 text-[11px] text-vp-text-3">
        O slug define a URL da editoria no site (ex: /editoria/politica). Use apenas letras minúsculas, números e hífens.
      </p>
    </div>
  );
}

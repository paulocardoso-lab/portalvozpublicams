import React from 'react';
import { prisma } from '@/lib/prisma';
import { createSection, deleteSection, updateSection, updateSectionMenu } from '@/app/actions/section';

export const dynamic = 'force-dynamic';

export default async function AdminSectionsPage() {
  const sections = await prisma.section.findMany({
    orderBy: [{ showInMenu: 'desc' }, { menuOrder: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { articles: true } } },
  });

  const visibleCount = sections.filter((section) => section.showInMenu).length;

  return (
    <div className="max-w-[1040px] space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[24px] font-display font-bold">Editorias</h1>
          <p className="mt-1 text-[13px] text-vp-text-3">
            Crie e organize as categorias de notícias do portal.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <div className="border border-vp-border bg-[#141413] px-4 py-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">Cadastradas</div>
            <div className="font-mono text-[20px] font-bold">{sections.length}</div>
          </div>
          <div className="border border-vp-border bg-[#141413] px-4 py-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">No menu</div>
            <div className="font-mono text-[20px] font-bold">{visibleCount}</div>
          </div>
        </div>
      </div>

      <section className="border border-vp-border bg-[#141413] p-5">
        <div className="mb-4">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-vp-accent">Nova editoria</h2>
          <p className="mt-1 text-[12px] text-vp-text-3">
            O slug pode ficar em branco: o sistema gera automaticamente a partir do nome.
          </p>
        </div>

        <form action={createSection} className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Nome *</span>
              <input name="name" className="vp-input text-[13px]" placeholder="Ex: Política" required />
            </label>
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Slug da URL</span>
              <input
                name="slug"
                className="vp-input text-[13px] font-mono"
                placeholder="politica"
                pattern="[a-z0-9\-]*"
                title="Apenas letras minúsculas, números e hífens"
              />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Descrição</span>
            <input
              name="description"
              className="vp-input text-[13px]"
              placeholder="Cobertura do Executivo, Legislativo e Judiciário de MS"
            />
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input name="showInMenu" type="checkbox" className="accent-vp-accent" defaultChecked />
              <span>Exibir no menu principal</span>
            </label>
            <label className="flex items-center gap-2 text-[13px]">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Ordem:</span>
              <input name="menuOrder" type="number" defaultValue="0" min="0" className="vp-input w-20 text-[13px] font-mono" />
            </label>
            <button type="submit" className="vp-btn vp-btn-primary px-6 py-2 text-[13px] sm:ml-auto">
              Criar editoria
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden border border-vp-border bg-[#141413]">
        {sections.length === 0 ? (
          <div className="px-5 py-12 text-center text-vp-text-3 italic">
            Nenhuma editoria cadastrada. Use o formulário acima para criar a primeira.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-vp-border text-[10px] uppercase tracking-wider text-vp-text-3">
                  <th className="px-4 py-3">Editoria</th>
                  <th className="px-4 py-3">URL pública</th>
                  <th className="px-4 py-3 text-center">Menu</th>
                  <th className="px-4 py-3 text-center">Ordem</th>
                  <th className="px-4 py-3 text-center">Matérias</th>
                  <th className="px-4 py-3 text-right">Exclusão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vp-border">
                {sections.map((section) => (
                  <React.Fragment key={section.id}>
                    <tr className="transition-colors hover:bg-vp-surface/30">
                      <td className="px-4 py-3">
                        <div className="font-semibold">{section.name}</div>
                        {section.description && (
                          <div className="mt-0.5 max-w-[280px] truncate text-[11px] text-vp-text-4">{section.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px] text-vp-text-3">/editoria/{section.slug}</td>
                      <td className="px-4 py-3 text-center">
                        <form action={updateSectionMenu.bind(null, section.id, {
                          showInMenu: !section.showInMenu,
                          menuOrder: section.menuOrder,
                        })}>
                          <button
                            type="submit"
                            className={`rounded border px-2.5 py-0.5 text-[10px] font-bold uppercase transition-all ${
                              section.showInMenu
                                ? 'border-vp-ok/30 bg-vp-ok/10 text-vp-ok'
                                : 'border-vp-text-3/30 bg-vp-text-3/10 text-vp-text-3 hover:border-vp-ok/30 hover:bg-vp-ok/10 hover:text-vp-ok'
                            }`}
                          >
                            {section.showInMenu ? 'Visível' : 'Oculto'}
                          </button>
                        </form>
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-[12px]">{section.menuOrder}</td>
                      <td className="px-4 py-3 text-center font-mono text-[12px]">{section._count.articles}</td>
                      <td className="px-4 py-3 text-right">
                        {section._count.articles === 0 ? (
                          <form action={deleteSection.bind(null, section.id)}>
                            <button type="submit" className="vp-btn px-2.5 py-1 text-[11px] text-vp-urgent border-vp-urgent hover:bg-vp-urgent/10">
                              Excluir
                            </button>
                          </form>
                        ) : (
                          <span className="text-[11px] italic text-vp-text-4">Protegida</span>
                        )}
                      </td>
                    </tr>
                    <tr className="bg-vp-surface/20">
                      <td colSpan={6} className="px-4 py-3">
                        <form action={updateSection.bind(null, section.id)} className="grid gap-2 lg:grid-cols-[1fr_1fr_1.4fr_auto_auto] lg:items-end">
                          <label className="grid gap-1">
                            <span className="text-[10px] text-vp-text-4 uppercase font-semibold">Nome</span>
                            <input name="name" className="vp-input text-[12px]" defaultValue={section.name} required />
                          </label>
                          <label className="grid gap-1">
                            <span className="text-[10px] text-vp-text-4 uppercase font-semibold">Slug</span>
                            <input name="slug" className="vp-input text-[12px] font-mono" defaultValue={section.slug} pattern="[a-z0-9\-]+" required />
                          </label>
                          <label className="grid gap-1">
                            <span className="text-[10px] text-vp-text-4 uppercase font-semibold">Descrição</span>
                            <input name="description" className="vp-input text-[12px]" defaultValue={section.description ?? ''} />
                          </label>
                          <label className="flex items-center gap-2 pb-2 text-[12px]">
                            <input name="showInMenu" type="checkbox" className="accent-vp-accent" defaultChecked={section.showInMenu} />
                            Menu
                          </label>
                          <div className="flex items-end gap-2">
                            <label className="grid gap-1">
                              <span className="text-[10px] text-vp-text-4 uppercase font-semibold">Ordem</span>
                              <input name="menuOrder" type="number" className="vp-input w-20 text-[12px] font-mono" defaultValue={section.menuOrder} min="0" />
                            </label>
                            <button type="submit" className="vp-btn vp-btn-primary px-4 py-2 text-[11px]">
                              Salvar
                            </button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-[11px] text-vp-text-3">
        A editoria fica disponível em /editoria/slug e também aparece nas telas de criação de matérias.
      </p>
    </div>
  );
}

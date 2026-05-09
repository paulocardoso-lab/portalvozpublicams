'use client';

import React, { useState } from 'react';
import { updateSectionMenu } from '@/app/actions/section';
import { Section } from '@prisma/client';

export default function SectionsClient({ initialSections }: { initialSections: Section[] }) {
  const [sections, setSections] = useState(initialSections);
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggleMenu = async (id: string, currentShow: boolean, order: number) => {
    setLoading(id);
    try {
      await updateSectionMenu(id, { showInMenu: !currentShow, menuOrder: order });
      setSections(prev => prev.map(s => s.id === id ? { ...s, showInMenu: !currentShow } : s));
    } finally {
      setLoading(null);
    }
  };

  const handleOrderChange = async (id: string, newOrder: number, showInMenu: boolean) => {
    setLoading(id);
    try {
      await updateSectionMenu(id, { showInMenu, menuOrder: newOrder });
      setSections(prev => prev.map(s => s.id === id ? { ...s, menuOrder: newOrder } : s));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-vp-surface border border-vp-border rounded overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-[#111] border-b border-vp-border">
          <tr>
            <th className="px-6 py-4 font-sans text-[11px] uppercase tracking-wider">Nome</th>
            <th className="px-6 py-4 font-sans text-[11px] uppercase tracking-wider">Slug</th>
            <th className="px-6 py-4 font-sans text-[11px] uppercase tracking-wider text-center">No Menu</th>
            <th className="px-6 py-4 font-sans text-[11px] uppercase tracking-wider text-center">Ordem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-vp-border">
          {sections.map((section) => (
            <tr key={section.id} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 font-medium">{section.name}</td>
              <td className="px-6 py-4 text-vp-text-3 text-sm">{section.slug}</td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => handleToggleMenu(section.id, section.showInMenu, section.menuOrder)}
                  disabled={loading === section.id}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                    section.showInMenu 
                      ? 'bg-vp-accent/20 text-vp-accent border border-vp-accent/30' 
                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}
                >
                  {section.showInMenu ? 'Visível' : 'Oculto'}
                </button>
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="number"
                  value={section.menuOrder}
                  onChange={(e) => handleOrderChange(section.id, parseInt(e.target.value), section.showInMenu)}
                  className="w-16 bg-vp-bg border border-vp-border rounded px-2 py-1 text-center text-sm"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

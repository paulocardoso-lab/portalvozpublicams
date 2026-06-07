"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ImgPH } from '@/components/shared/ImgPH';
import { BrandLogo } from '@/components/shared/BrandLogo';

export function AdminSidebar() {
  const pathname = usePathname() || '';
  
  const nav: { id: string; label: string; icon: string; href: string; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '□', href: '/admin' },
    { id: 'posts',     label: 'Matérias', icon: '≡', href: '/admin/posts' },
    { id: 'editor',    label: 'Nova matéria', icon: '✎', href: '/admin/posts/new' },
    { id: 'podcasts',  label: 'Podcasts', icon: '🎧', href: '/admin/podcasts' },
    { id: 'sections',  label: 'Editorias', icon: '📁', href: '/admin/sections' },
    { id: 'kanban',    label: 'Fila editorial', icon: '▦', href: '/admin/kanban' },
    { id: 'alerts',    label: 'Faixa ao vivo (Alertas)', icon: '⚠', href: '/admin/alerts' },
    { id: 'agenda',    label: 'Agenda pública', icon: '⌚', href: '/admin/agenda' },
    { id: 'rss',       label: 'Automação RSS', icon: '∞', href: '/admin/rss' },
    { id: 'rss-fila',  label: 'Fila RSS', icon: '⏳', href: '/admin/rss/fila' },
    { id: 'market',    label: 'Indicadores', icon: '∿', href: '/admin/metrics/market' },
    { id: 'denuncias', label: 'Denúncias', icon: '⚐', href: '/admin/denuncias' },
    { id: 'comments',  label: 'Comentários', icon: '◉', href: '/admin/comments' },
    { id: 'users',     label: 'Usuários & permissões', icon: '◎', href: '/admin/users' },
    { id: 'ads',       label: 'Banners & publicidade', icon: '▭', href: '/admin/ads' },
    { id: 'appearance',label: 'Aparência & layout', icon: '⌘', href: '/admin/appearance' },
    { id: 'social',    label: 'Redes sociais', icon: '#', href: '/admin/social' },
    { id: 'metrics',   label: 'Métricas & tráfego', icon: '↗', href: '/admin/metrics' },
    { id: 'subscriptions', label: 'Assinaturas & doações', icon: '♥', href: '/admin/subscriptions' },
    { id: 'audit',     label: 'Logs de auditoria', icon: '⎆', href: '/admin/audit' },
    { id: 'health',    label: 'Saúde do sistema', icon: '✓', href: '/admin/health' },
    { id: 'profile',   label: 'Meu perfil', icon: '◐', href: '/admin/profile' },
    { id: 'settings',  label: 'Configurações', icon: '⚙', href: '/admin/settings' },
  ];

  return (
    <aside className="bg-vp-bg border-r border-vp-border py-4.5 flex flex-col gap-3.5 sticky top-0 h-[100dvh] w-[232px]">
      <div className="px-4.5 pb-4.5 border-b border-vp-border flex items-center gap-2.5">
        <Link href="/" className="no-underline">
          <BrandLogo size="md" cssHeight="var(--vp-admin-logo-size)" />
        </Link>
        <div className="text-[11px] text-vp-text-3 tracking-[0.1em] uppercase ml-auto">Admin</div>
      </div>
      
      <nav className="grid gap-0.5 px-2.5 flex-1 overflow-y-auto vp-scroll">
        {nav.map(n => {
          const exactMatch = ['/', '/admin', '/admin/rss'];
          const isActive = pathname === n.href || (!exactMatch.includes(n.href) && pathname.startsWith(n.href));
          return (
            <Link key={n.id} href={n.href} className={`flex items-center gap-2.5 px-3 py-2 rounded cursor-pointer no-underline ${isActive ? 'bg-vp-surface-2 text-vp-text border-l-2 border-vp-accent' : 'bg-transparent text-vp-text-2 border-l-2 border-transparent hover:bg-vp-surface transition-colors'}`}>
              <span className={`w-4 text-center ${isActive ? 'text-vp-accent' : 'text-vp-text-3'}`}>{n.icon}</span>
              <span className={`flex-1 text-[13px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{n.label}</span>
              {n.badge && <span className="bg-vp-accent text-[#1a1a19] text-[10px] font-bold px-1.5 py-0.5 rounded-[10px]">{n.badge}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-vp-border p-3.5 flex items-center gap-2.5 bg-vp-bg">
        <div className="w-[32px] h-[32px] rounded-full overflow-hidden shrink-0">
          <ImgPH label="" width={32} height={32} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-semibold truncate">Usuário administrativo</div>
          <div className="text-[10px] text-vp-accent uppercase tracking-[0.08em]">Admin</div>
        </div>
        <Link href="/" className="text-[11px] text-vp-text-3 hover:text-vp-text no-underline">Sair</Link>
      </div>
    </aside>
  );
}

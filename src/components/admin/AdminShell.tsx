"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { Monogram } from '@/components/shared/Monogram';
import { ImgPH } from '@/components/shared/ImgPH';
import { SafeImage } from '@/components/shared/SafeImage';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

const nav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '□', href: '/admin' },
  { id: 'posts',     label: 'Matérias', icon: '≡', href: '/admin/posts' },
  { id: 'editor',    label: 'Nova matéria', icon: '✎', href: '/admin/posts/new' },
  { id: 'kanban',    label: 'Fila editorial', icon: '▦', href: '/admin/kanban' },
  { id: 'comments',  label: 'Comentários', icon: '◉', href: '/admin/comments' },
  { id: 'users',     label: 'Usuários & permissões', icon: '◎', href: '/admin/users' },
  { id: 'ads',       label: 'Banners & publicidade', icon: '▭', href: '/admin/ads' },
  { id: 'rss',       label: 'Automação RSS', icon: '📡', href: '/admin/rss' },
  { id: 'podcasts',  label: 'Podcasts', icon: '🎙', href: '/admin/podcasts' },
  { id: 'social',    label: 'Redes sociais', icon: '#', href: '/admin/social' },
  { id: 'metrics',   label: 'Métricas & tráfego', icon: '↗', href: '/admin/metrics' },
  { id: 'market',    label: 'Indicadores do cabeçalho', icon: '$', href: '/admin/metrics/market' },
  { id: 'subscriptions', label: 'Assinaturas & doações', icon: '♥', href: '/admin/subscriptions' },
  { id: 'audit',     label: 'Logs de auditoria', icon: '⎆', href: '/admin/audit' },
  { id: 'health',    label: 'Saúde do sistema', icon: '✓', href: '/admin/health' },
  { id: 'settings',  label: 'Configurações', icon: '⚙', href: '/admin/settings' },
];


interface AdminShellProps {
  children: React.ReactNode;
  pendingComments: number;
  draftArticles: number;
  reviewArticles: number;
}

export function AdminShell({ children, pendingComments, draftArticles, reviewArticles }: AdminShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const user = session?.user;
  const userName = user?.name || user?.email?.split('@')[0] || "Administrador";
  const userRole = (user as { role?: string } | undefined)?.role || "Sem papel";

  return (
    <div className="flex min-h-screen bg-[#111110] text-vp-text font-sans">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - 232px Fixed */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[232px] bg-[#0e0e0d] border-r border-vp-border flex flex-col h-screen transition-transform lg:translate-x-0 lg:sticky lg:top-0 shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="px-5 pt-5 pb-4 border-b border-vp-border flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <Monogram size={56} />
            <div className="text-[9px] text-vp-text-4 font-black uppercase tracking-[0.18em]">Painel Administrativo</div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-vp-text-4 mt-1">×</button>
        </div>

        <nav className="flex-1 overflow-y-auto vp-scroll py-4 px-2.5 space-y-1">
          {nav.map((item) => {
            const n = item.id === 'comments' && pendingComments > 0
              ? { ...item, badge: pendingComments }
              : item;
            const active = pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href));
            return (
              <Link
                key={n.id}
                href={n.href}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-all group no-underline ${
                  active 
                    ? 'bg-vp-surface text-vp-text border-l-2 border-vp-accent' 
                    : 'text-vp-text-3 hover:text-vp-text hover:bg-vp-surface/40 border-l-2 border-transparent'
                }`}
              >
                <span className={`w-4 text-center font-mono text-[16px] ${active ? 'text-vp-accent' : 'text-vp-text-4 group-hover:text-vp-text-3'}`}>
                  {n.icon}
                </span>
                <span className={`flex-1 text-[13px] tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>
                  {n.label}
                </span>
                {n.badge && (
                  <span className="bg-vp-accent text-vp-bg text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {n.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div className="p-4 border-t border-vp-border flex items-center gap-3 bg-[#0a0a09]">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-vp-border">
            {user?.image ? (
                <SafeImage src={user.image} alt="" fill sizes="32px" className="object-cover" />
            ) : (
                <ImgPH label="" width={32} height={32} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-bold text-vp-text truncate">{userName}</div>
            <div className="text-[9px] text-vp-accent font-black uppercase tracking-wider">{userRole}</div>
          </div>
          <button 
            onClick={() => nextAuthSignOut({ callbackUrl: '/' })}
            className="text-vp-text-4 hover:text-vp-urgent text-[11px] font-bold transition-colors uppercase"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#111110]">
        {/* Topbar */}
        <header className="h-[64px] flex items-center justify-between px-6 border-b border-vp-border bg-[#141413] sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-[420px]">
             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-vp-text-3 p-1"
             >
                ☰
             </button>
             <div className="relative group flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-vp-text-4 font-mono">/</span>
                <input 
                  className="vp-input w-full pl-8 py-2 text-[13px] bg-[#0e0e0d] border-vp-border" 
                  placeholder="Buscar matérias, autores, tags..." 
                />
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-vp-text-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-vp-ok animate-pulse" />
                <span className="text-vp-ok">Online</span>
              </div>
              <div className="h-4 w-[1px] bg-vp-border" />
              <span>{draftArticles} em rascunho</span>
              <span>{reviewArticles} em revisão</span>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/" target="_blank" className="vp-btn text-[11px] px-4 py-2 hover:bg-vp-surface">
                Ver site →
              </Link>
              <Link href="/admin/posts/new" className="vp-btn vp-btn-primary text-[11px] px-4 py-2">
                + Nova matéria
              </Link>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

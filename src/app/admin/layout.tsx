import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

function AdminTopbar() {
  return (
    <div className="flex items-center gap-3.5 py-3 px-5.5 border-b border-vp-border bg-[#141413] sticky top-0 z-10">
      <input className="vp-input w-full max-w-[420px]" placeholder="Buscar matérias, autores, tags…" aria-label="Buscar matérias" />
      <div className="ml-auto flex gap-2.5 items-center text-[12px]">
        <span className="bg-vp-ok text-[#0e0e0d] px-1.5 py-0.5 rounded-[2px] font-bold uppercase tracking-[0.05em] text-[10px]">● Online</span>
        <span className="text-vp-text-3 ml-2 hidden lg:inline">Admin Panel</span>
        <Link href="/" className="vp-btn text-[12px] py-1.5 px-3 no-underline ml-2">Ver site →</Link>
      </div>
    </div>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try {
    session = await auth();
  } catch (err) {
    console.error("Auth error in layout:", err);
  }

  // Se não estiver logado, redireciona para login
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="w-full min-h-[100dvh] grid grid-cols-[232px_1fr] bg-[#111110] text-vp-text font-sans">
      <AdminSidebar />
      <main className="min-w-0 flex flex-col relative">
        <AdminTopbar />
        <div className="p-6">
          <div className="mb-4 p-4 bg-vp-surface-2 border border-vp-border rounded">
            <h2 className="text-vp-accent font-bold">Debug: Admin Access</h2>
            <p className="text-[12px]">User: {session.user.email}</p>
            <p className="text-[12px]">Role: {(session.user as any).role || 'READER'}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

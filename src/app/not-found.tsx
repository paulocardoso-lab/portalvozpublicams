import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-vp-bg text-vp-text px-4 text-center">
      <h1 className="font-display text-[80px] leading-none mb-4 text-vp-accent opacity-20">404</h1>
      <h2 className="font-display text-[32px] mb-4">Página não encontrada</h2>
      <p className="font-serif text-vp-text-2 max-w-[400px] mb-8">
        O conteúdo que você procura não existe, foi removido ou está em uma nova localização.
      </p>
      <Link href="/">
        <button className="vp-btn vp-btn-primary px-8 py-3">Voltar ao Início</button>
      </Link>
    </div>
  );
}

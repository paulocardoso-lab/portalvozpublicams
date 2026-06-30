'use client';

import React from 'react';
import { NewsletterForm } from '@/components/shared/NewsletterForm';

export function NewsletterSection() {
  return (
    <section className="bg-vp-surface border-y border-vp-border py-16 px-7 my-12">
      <div className="max-w-360 mx-auto grid md:grid-cols-[1.5fr_1fr] items-center gap-12">
        <div>
          <h2 className="vp-headline text-[48px] font-black mb-4 leading-[1.1]">
            A verdade direto no <span className="italic text-vp-accent">seu e-mail.</span>
          </h2>
          <p className="text-vp-text-2 font-serif text-[18px] leading-normal max-w-125">
            Assine nossa newsletter e receba as principais investigações e análises do Mato Grosso do Sul todas as semanas.
          </p>
        </div>

        <div>
          <NewsletterForm
            layout="vertical"
            placeholder="Seu melhor e-mail..."
            buttonText="Quero receber"
          />
          <p className="text-[11px] text-vp-text-4 text-center font-sans mt-2">
            Ao se inscrever, você concorda com nossa Política de Privacidade.
          </p>
        </div>
      </div>
    </section>
  );
}

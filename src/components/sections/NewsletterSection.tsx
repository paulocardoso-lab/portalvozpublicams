import React from 'react';

export function NewsletterSection() {
  return (
    <section className="bg-vp-surface border-y border-vp-border py-16 px-6 my-12">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1.5fr_1fr] items-center gap-12">
        <div>
          <h2 className="font-display text-[48px] leading-[0.95] mb-4 tracking-tighter">
            A verdade direto no <span className="italic text-vp-accent">seu e-mail.</span>
          </h2>
          <p className="text-vp-text-2 text-[18px] leading-relaxed max-w-[500px]">
            Assine nossa newsletter e receba as principais investigações e análises do Mato Grosso do Sul todas as manhãs.
          </p>
        </div>
        
        <form className="flex flex-col gap-3">
          <input 
            type="email" 
            placeholder="Seu melhor e-mail..." 
            className="vp-input py-4 px-5 text-[16px]"
            required
          />
          <button type="submit" className="vp-btn vp-btn-primary py-4 text-[14px] font-bold tracking-widest">
            QUERO RECEBER
          </button>
          <p className="text-[11px] text-vp-text-4 text-center">
            Ao se inscrever, você concorda com nossa Política de Privacidade.
          </p>
        </form>
      </div>
    </section>
  );
}

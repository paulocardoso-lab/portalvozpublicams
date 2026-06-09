import type { Metadata } from 'next';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contato — Voz Pública MS',
  description: 'Entre em contato com a redação do Voz Pública MS.',
};

export default function ContatoPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <span className="text-[11px] font-bold uppercase tracking-widest text-vp-accent">Institucional</span>
      <h1 className="font-display text-[32px] sm:text-[42px] font-black leading-[1.05] tracking-tight mt-2 mb-3">
        Fale com a redação
      </h1>
      <p className="font-serif text-[16px] text-vp-text-2 leading-relaxed mb-8">
        Tem uma dúvida, uma sugestão de pauta ou encontrou um erro em alguma publicação?
        Preencha o formulário abaixo. Retornamos em até 2 dias úteis.
      </p>

      <ContactForm />

      <div className="mt-12 border-t border-vp-border pt-8 grid sm:grid-cols-2 gap-6 text-[13px] font-sans text-vp-text-2">
        <div>
          <p className="font-bold text-vp-text text-[11px] uppercase tracking-widest mb-2">Denúncias protegidas</p>
          <p className="font-serif text-[14px] leading-relaxed">
            Para informações sensíveis que exijam anonimato e proteção de fonte, use nosso{' '}
            <a href="/denuncia" className="text-vp-accent hover:text-vp-accent-hover transition-colors font-bold">
              canal criptografado de denúncias →
            </a>
          </p>
        </div>
        <div>
          <p className="font-bold text-vp-text text-[11px] uppercase tracking-widest mb-2">Publicidade</p>
          <p className="font-serif text-[14px] leading-relaxed">
            Para anunciar no portal, entre em contato direto por{' '}
            <a
              href="mailto:publicidade@vozpublicams.com.br"
              className="text-vp-accent hover:text-vp-accent-hover transition-colors font-bold"
            >
              publicidade@vozpublicams.com.br →
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

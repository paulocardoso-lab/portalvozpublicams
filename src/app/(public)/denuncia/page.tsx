import { DenunciaForm } from './DenunciaForm';

export default function DenunciaPage() {
  return (
    <main className="max-w-200 mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <h1 className="font-display text-[32px] sm:text-[48px] leading-[0.95] mb-4 sm:mb-6 tracking-tighter">
          Sua voz é a nossa <span className="italic text-vp-accent">arma.</span>
        </h1>
        <p className="text-vp-text-2 text-[16px] sm:text-[18px] leading-relaxed">
          Tem uma informação exclusiva, um documento ou flagrou alguma irregularidade no Mato Grosso do Sul? Envie para nossa equipe de investigação. Garantimos o sigilo absoluto da fonte.
        </p>
      </div>

      <DenunciaForm />

      <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-[13px] sm:text-[14px] text-vp-text-3">
        <div className="border-l-2 border-vp-accent pl-4">
          <h4 className="text-vp-text font-bold mb-2">Sigilo da Fonte</h4>
          O sigilo da fonte é um direito constitucional (Art. 5º, XIV). O Voz Pública MS nunca revelará sua identidade sem sua autorização expressa.
        </div>
        <div className="border-l-2 border-vp-accent pl-4">
          <h4 className="text-vp-text font-bold mb-2">Canais Alternativos</h4>
          Se preferir, envie via WhatsApp ou Signal: <br />
          <strong>(67) 99999-0000</strong>
        </div>
      </div>
    </main>
  );
}

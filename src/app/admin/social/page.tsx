import React from 'react';

export default function AdminSocialPage() {
  return (
    <div className="max-w-[1200px]">
      <h1 className="text-[22px] font-semibold mb-1">Redes sociais</h1>
      <p className="text-vp-text-3 text-[13px] mb-5">
        Nenhum canal social foi configurado para publicação automática.
      </p>

      <div className="bg-[#141413] border border-vp-border rounded-[4px] px-6 py-14 text-center">
        <h2 className="text-[16px] font-semibold mb-2">Integrações sociais indisponíveis</h2>
        <p className="text-[13px] text-vp-text-3 max-w-[560px] mx-auto leading-relaxed">
          Esta área está pronta para receber integrações reais de redes sociais. Até que credenciais e provedores sejam configurados, nenhuma contagem de seguidores, postagem agendada ou automação será exibida.
        </p>
      </div>
    </div>
  );
}

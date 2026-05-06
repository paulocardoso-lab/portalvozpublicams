import React from 'react';
import { ImgPH } from '@/components/shared/ImgPH';

export default function AdminProfilePage() {
  return (
    <div className="max-w-[900px]">
      <h1 className="text-[22px] font-semibold mb-1">Meu perfil</h1>
      <p className="text-vp-text-3 text-[13px] mb-5">Página pública de autor + dados da conta</p>

      <div className="bg-[#141413] border border-vp-border p-5.5 rounded-[4px] mb-3.5">
        <div className="grid md:grid-cols-[120px_1fr] gap-5.5 items-start">
          <div>
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden mx-auto">
              <ImgPH label="foto" width={120} height={120} />
            </div>
            <button className="vp-btn w-full mt-2 text-[11px] justify-center">Trocar</button>
          </div>
          <div className="grid gap-3 text-[12px]">
            <div className="grid grid-cols-2 gap-2.5">
              <label>Nome<input className="vp-input mt-1 w-full" defaultValue="Marina" /></label>
              <label>Sobrenome<input className="vp-input mt-1 w-full" defaultValue="Ribeiro" /></label>
            </div>
            <label>Bio (aparece na página de autor)
              <textarea className="vp-input mt-1 w-full font-serif resize-y" rows={3} defaultValue="Editora-chefe do Voz Pública MS. Jornalista há 18 anos, cobriu o Pantanal para Folha, Piauí e El País. Autora de 'O Rio dos Mortos' (2023)." />
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <label>E-mail<input className="vp-input mt-1 w-full" defaultValue="marina@vozpublicams.com.br" /></label>
              <label>Telefone<input className="vp-input mt-1 w-full" defaultValue="(67) 99999-0000" /></label>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <label>Instagram<input className="vp-input mt-1 w-full" defaultValue="@marinaribeiro" /></label>
              <label>X / Twitter<input className="vp-input mt-1 w-full" defaultValue="@marinaribeiro" /></label>
              <label>LinkedIn<input className="vp-input mt-1 w-full" defaultValue="/in/marinaribeiro" /></label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px] mb-3.5">
        <h3 className="text-[13px] font-semibold mb-3">Segurança</h3>
        <div className="grid gap-2.5 text-[13px]">
          <div className="flex justify-between items-center p-3 bg-vp-bg border border-vp-border rounded-[4px]">
            <div>
              <div className="font-semibold mb-0.5">Senha</div>
              <div className="text-[11px] text-vp-text-3">Alterada há 48 dias · forte</div>
            </div>
            <button className="vp-btn text-[12px]">Alterar</button>
          </div>
          <div className="flex justify-between items-center p-3 bg-vp-bg border border-vp-border rounded-[4px]">
            <div>
              <div className="font-semibold mb-0.5 flex items-center">
                Autenticação de 2 fatores <span className="vp-tag bg-vp-ok text-[#1a1a19] border-transparent ml-1.5 px-1.5 py-0">ATIVO</span>
              </div>
              <div className="text-[11px] text-vp-text-3">App autenticador · Google Authenticator</div>
            </div>
            <button className="vp-btn text-[12px]">Gerenciar</button>
          </div>
          <div className="flex justify-between items-center p-3 bg-vp-bg border border-vp-border rounded-[4px]">
            <div>
              <div className="font-semibold mb-0.5">Sessões ativas</div>
              <div className="text-[11px] text-vp-text-3">3 dispositivos · MacBook (agora), iPhone 15 (há 2h), Chrome Win (ontem)</div>
            </div>
            <button className="vp-btn text-[12px] text-vp-urgent border-vp-urgent hover:bg-vp-urgent/10 whitespace-nowrap">Encerrar outras</button>
          </div>
        </div>
      </div>

      <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px] mb-8">
        <h3 className="text-[13px] font-semibold mb-3">Notificações</h3>
        {[
          ['E-mail quando enviarem matéria para minha revisão', true],
          ['E-mail quando comentários em minhas matérias forem sinalizados', true],
          ['Push no mobile para urgências editoriais', true],
          ['Relatório semanal de performance das minhas matérias', true],
          ['Newsletter interna da redação', false],
        ].map(([l, v], i) => (
          <label key={i} className={`flex justify-between items-center py-2.5 text-[13px] ${i < 4 ? 'border-b border-vp-border' : ''} cursor-pointer`}>
            <span>{String(l)}</span>
            <span className={`inline-block w-7 h-4 rounded-full relative transition-colors shrink-0 ${v ? 'bg-vp-accent' : 'bg-vp-border-2'}`}>
              <span className={`absolute top-[2px] w-3 h-3 bg-white rounded-full transition-all ${v ? 'left-[14px]' : 'left-[2px]'}`} />
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

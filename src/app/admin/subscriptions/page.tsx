import React from "react";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { saveDonationSettings, updateSubscriptionStatus } from "./actions";
import { SubStatus } from "@prisma/client";
import { centsToCurrencyInput, getDonationConfig, isDonationsEnabled } from "@/lib/donation-config";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function amountList(values: number[]) {
  return values.map(centsToCurrencyInput).join(", ");
}

export default async function AdminSubscriptionsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();

  const query = await searchParams;
  const saved = firstParam(query.saved) === "1";

  const [subscriptions, donationConfig, donationsEnabled] = await Promise.all([
    prisma.subscription.findMany({
      select: {
        id: true,
        plan: true,
        amount: true,
        method: true,
        status: true,
        startedAt: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { startedAt: "desc" },
    }),
    getDonationConfig(),
    isDonationsEnabled(),
  ]);

  const total = subscriptions.filter((s) => s.status === "ACTIVE").reduce((sum, s) => sum + s.amount, 0);
  const plans = [...donationConfig.plans];
  while (plans.length < 6) {
    plans.push({
      key: "",
      name: "",
      amountCents: 0,
      interval: "monthly",
      description: "",
      benefits: "",
      isActive: false,
      isHighlighted: false,
      displayOrder: (plans.length + 1) * 10,
    });
  }

  const PLAN_LABELS: Record<string, string> = {
    READER: "Leitor",
    SUPPORTER: "Apoiador",
    GUARDIAN: "Guardião",
    PATRON: "Patrono",
    CUSTOM: "Personalizado",
  };

  const STATUS_COLORS: Record<string, string> = {
    ACTIVE: "text-vp-ok border-vp-ok bg-vp-ok/10",
    PAST_DUE: "text-vp-warn border-vp-warn bg-vp-warn/10",
    CANCELLED: "text-vp-text-3 border-vp-text-3 bg-vp-text-3/10",
    PAUSED: "text-vp-accent border-vp-accent bg-vp-accent/10",
  };

  return (
    <div className="max-w-[1180px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold mb-1">Assinaturas & Doações</h1>
        <p className="text-vp-text-3 text-[13px]">
          {subscriptions.filter((s) => s.status === "ACTIVE").length} assinaturas ativas · R$ {(total / 100).toFixed(2).replace(".", ",")} / mês
        </p>
      </div>

      {saved ? (
        <div className="mb-5 border border-vp-ok/30 bg-vp-ok/10 px-4 py-3 text-[12px] font-semibold text-vp-ok">
          Configurações de apoio salvas com sucesso.
        </div>
      ) : null}

      {/* Toggle de acesso público */}
      <div className={`mb-5 flex items-center justify-between gap-4 px-5 py-4 rounded border ${donationsEnabled ? "border-vp-ok/40 bg-vp-ok/5" : "border-vp-urgent/40 bg-vp-urgent/5"}`}>
        <div>
          <div className={`text-[13px] font-semibold ${donationsEnabled ? "text-vp-ok" : "text-vp-urgent"}`}>
            {donationsEnabled ? "Página de apoio ATIVA" : "Página de apoio DESATIVADA"}
          </div>
          <div className="text-[11px] text-vp-text-3 mt-0.5">
            {donationsEnabled
              ? "A página /apoiar e todos os cards e botões de doação estão visíveis ao público."
              : "O acesso a /apoiar está bloqueado. Todos os botões e cards de doação estão ocultos."}
          </div>
        </div>
        <form action={saveDonationSettings}>
          <input type="hidden" name="_enableDonationsOnly" value="1" />
          <input type="hidden" name="enableDonations" value={donationsEnabled ? "false" : "true"} />
          <button
            type="submit"
            className={`vp-btn px-4 py-2 text-[12px] font-bold whitespace-nowrap ${donationsEnabled ? "text-vp-urgent border-vp-urgent" : "text-vp-ok border-vp-ok"}`}
          >
            {donationsEnabled ? "Desativar acesso" : "Ativar acesso"}
          </button>
        </form>
      </div>

      <form action={saveDonationSettings} className="grid gap-5 mb-8">
        <section className="bg-[#141413] border border-vp-border p-5 rounded">
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold">Planos e Pacotes</h2>
            <p className="text-[12px] text-vp-text-3 mt-1">Configure valores, benefícios, destaque e ordem dos pacotes de apoio.</p>
          </div>

          <div className="grid gap-4">
            {plans.map((plan, index) => (
              <div key={index} className="border border-vp-border bg-vp-surface/30 p-4 rounded">
                <div className="grid gap-3 lg:grid-cols-[120px_1fr_120px_120px_80px]">
                  <label className="grid gap-1">
                    <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Chave</span>
                    <input name={`plan_${index}_key`} className="vp-input text-[12px] font-mono" defaultValue={plan.key} placeholder="apoiador" />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Nome</span>
                    <input name={`plan_${index}_name`} className="vp-input text-[12px]" defaultValue={plan.name} placeholder="Apoiador" />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Valor R$</span>
                    <input name={`plan_${index}_amount`} className="vp-input text-[12px] font-mono" defaultValue={plan.amountCents > 0 ? centsToCurrencyInput(plan.amountCents) : ""} placeholder="39,00" />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Tipo</span>
                    <select name={`plan_${index}_interval`} className="vp-input text-[12px]" defaultValue={plan.interval}>
                      <option value="monthly">Mensal</option>
                      <option value="one_time">Único</option>
                    </select>
                  </label>
                  <label className="grid gap-1">
                    <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Ordem</span>
                    <input name={`plan_${index}_order`} type="number" className="vp-input text-[12px] font-mono" defaultValue={plan.displayOrder} />
                  </label>
                </div>

                <div className="grid gap-3 lg:grid-cols-[1fr_1fr] mt-3">
                  <label className="grid gap-1">
                    <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Descrição curta</span>
                    <input name={`plan_${index}_description`} className="vp-input text-[12px]" defaultValue={plan.description} placeholder="Acesso aos bastidores e podcast extra." />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Benefícios</span>
                    <input name={`plan_${index}_benefits`} className="vp-input text-[12px]" defaultValue={plan.benefits} placeholder="Um benefício por linha ou separados por vírgula" />
                  </label>
                </div>

                <div className="flex flex-wrap gap-5 mt-3 text-[12px] text-vp-text-2">
                  <label className="inline-flex items-center gap-2">
                    <input name={`plan_${index}_active`} type="checkbox" defaultChecked={plan.isActive} />
                    Ativo
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input name={`plan_${index}_highlighted`} type="checkbox" defaultChecked={plan.isHighlighted} />
                    Destacar como mais escolhido
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="bg-[#141413] border border-vp-border p-5 rounded">
            <h2 className="text-[15px] font-semibold mb-4">Meta e Texto da Campanha</h2>
            <div className="grid gap-3">
              <div className="grid md:grid-cols-2 gap-3">
                <label className="grid gap-1">
                  <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Chamada pequena</span>
                  <input name="campaignEyebrow" className="vp-input text-[12px]" defaultValue={donationConfig.campaign.eyebrow} />
                </label>
                <label className="grid gap-1">
                  <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Título da meta</span>
                  <input name="campaignTitle" className="vp-input text-[12px]" defaultValue={donationConfig.campaign.title} />
                </label>
              </div>
              <label className="grid gap-1">
                <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Descrição</span>
                <textarea name="campaignDescription" className="vp-input text-[12px] h-20 resize-none" defaultValue={donationConfig.campaign.description} />
              </label>
              <div className="grid md:grid-cols-4 gap-3">
                <label className="grid gap-1">
                  <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Rótulo</span>
                  <input name="campaignGoalLabel" className="vp-input text-[12px]" defaultValue={donationConfig.campaign.goalLabel} />
                </label>
                <label className="grid gap-1">
                  <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Meta R$</span>
                  <input name="campaignGoal" className="vp-input text-[12px] font-mono" defaultValue={centsToCurrencyInput(donationConfig.campaign.goalCents)} />
                </label>
                <label className="grid gap-1">
                  <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Arrecadado R$</span>
                  <input name="campaignCurrent" className="vp-input text-[12px] font-mono" defaultValue={centsToCurrencyInput(donationConfig.campaign.currentCents)} />
                </label>
                <label className="grid gap-1">
                  <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Apoiadores</span>
                  <input name="campaignSupporterCount" type="number" className="vp-input text-[12px] font-mono" defaultValue={donationConfig.campaign.supporterCount} />
                </label>
              </div>
            </div>
          </section>

          <section className="bg-[#141413] border border-vp-border p-5 rounded">
            <h2 className="text-[15px] font-semibold mb-4">Doação Única e Métodos</h2>
            <div className="grid gap-4">
              <label className="grid gap-1">
                <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Valores sugeridos</span>
                <input name="oneTimeAmounts" className="vp-input text-[12px] font-mono" defaultValue={amountList(donationConfig.oneTimeAmountsCents)} placeholder="50,00, 100,00, 250,00" />
              </label>
              <div className="grid grid-cols-2 gap-3 text-[12px] text-vp-text-2">
                <label className="inline-flex items-center gap-2">
                  <input name="methodPix" type="checkbox" defaultChecked={donationConfig.paymentMethods.pix} />
                  PIX
                </label>
                <label className="inline-flex items-center gap-2">
                  <input name="methodCard" type="checkbox" defaultChecked={donationConfig.paymentMethods.card} />
                  Cartão
                </label>
                <label className="inline-flex items-center gap-2">
                  <input name="methodBoleto" type="checkbox" defaultChecked={donationConfig.paymentMethods.boleto} />
                  Boleto
                </label>
                <label className="inline-flex items-center gap-2">
                  <input name="methodBankTransfer" type="checkbox" defaultChecked={donationConfig.paymentMethods.bankTransfer} />
                  Transferência
                </label>
              </div>
            </div>
          </section>
        </div>

        <section className="bg-[#141413] border border-vp-border p-5 rounded">
          <h2 className="text-[15px] font-semibold mb-4">PIX e Dados Bancários</h2>
          <div className="grid gap-3">
            <div className="grid md:grid-cols-[140px_1fr_1fr_140px] gap-3">
              <label className="grid gap-1">
                <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Tipo chave</span>
                <input name="pixKeyType" className="vp-input text-[12px]" defaultValue={donationConfig.pix.keyType} placeholder="email, cpf, cnpj" />
              </label>
              <label className="grid gap-1">
                <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Chave PIX</span>
                <input name="pixKey" className="vp-input text-[12px] font-mono" defaultValue={donationConfig.pix.key} />
              </label>
              <label className="grid gap-1">
                <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Favorecido</span>
                <input name="pixReceiverName" className="vp-input text-[12px]" defaultValue={donationConfig.pix.receiverName} />
              </label>
              <label className="grid gap-1">
                <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Cidade</span>
                <input name="pixCity" className="vp-input text-[12px]" defaultValue={donationConfig.pix.city} />
              </label>
            </div>
            <div className="grid md:grid-cols-[1fr_1fr_1fr_1fr] gap-3">
              <label className="grid gap-1">
                <span className="text-[10px] text-vp-text-3 uppercase font-semibold">CPF/CNPJ</span>
                <input name="pixDocument" className="vp-input text-[12px] font-mono" defaultValue={donationConfig.pix.document} />
              </label>
              <label className="grid gap-1">
                <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Banco</span>
                <input name="bankName" className="vp-input text-[12px]" defaultValue={donationConfig.pix.bankName} />
              </label>
              <label className="grid gap-1">
                <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Agência</span>
                <input name="bankAgency" className="vp-input text-[12px] font-mono" defaultValue={donationConfig.pix.agency} />
              </label>
              <label className="grid gap-1">
                <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Conta</span>
                <input name="bankAccount" className="vp-input text-[12px] font-mono" defaultValue={donationConfig.pix.account} />
              </label>
            </div>
            <label className="grid gap-1">
              <span className="text-[10px] text-vp-text-3 uppercase font-semibold">PIX copia e cola</span>
              <textarea name="pixCopyPaste" className="vp-input text-[12px] font-mono h-20 resize-none" defaultValue={donationConfig.pix.copyPaste} />
            </label>
            <label className="grid gap-1">
              <span className="text-[10px] text-vp-text-3 uppercase font-semibold">Instruções para o apoiador</span>
              <textarea name="pixInstructions" className="vp-input text-[12px] h-20 resize-none" defaultValue={donationConfig.pix.instructions} />
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" className="vp-btn vp-btn-primary px-7 py-2.5 text-[13px] font-semibold">
            Salvar configurações de apoio
          </button>
        </div>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {["ACTIVE", "PAST_DUE", "CANCELLED", "PAUSED"].map((status) => {
          const count = subscriptions.filter((s) => s.status === status).length;
          return (
            <div key={status} className="bg-[#141413] border border-vp-border p-3.5 rounded">
              <div className="text-[24px] font-bold font-mono">{count}</div>
              <div className="text-[11px] text-vp-text-3 uppercase tracking-wider mt-0.5">
                {status === "ACTIVE" ? "Ativas" : status === "PAST_DUE" ? "Inadimplentes" : status === "CANCELLED" ? "Canceladas" : "Pausadas"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#141413] border border-vp-border rounded overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-[12px] min-w-[700px]">
          <thead>
            <tr className="border-b border-vp-border text-[10px] text-vp-text-3 uppercase tracking-wider">
              <th className="px-4 py-3">Assinante</th>
              <th className="px-4 py-3">Plano</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Método</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Desde</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vp-border">
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-vp-text-3 italic">
                  Nenhuma assinatura ainda.
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-vp-surface/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[13px]">{sub.user.name}</div>
                    <div className="text-[11px] text-vp-text-3">{sub.user.email}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{PLAN_LABELS[sub.plan] ?? sub.plan}</td>
                  <td className="px-4 py-3 font-mono">R$ {(sub.amount / 100).toFixed(2).replace(".", ",")}</td>
                  <td className="px-4 py-3 text-vp-text-3">{sub.method}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${STATUS_COLORS[sub.status] ?? ""}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-vp-text-3">
                    {sub.startedAt.toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {sub.status !== "ACTIVE" && (
                        <form action={updateSubscriptionStatus.bind(null, sub.id, SubStatus.ACTIVE)}>
                          <button type="submit" className="vp-btn text-[10px] px-2 py-1 text-vp-ok border-vp-ok">
                            Ativar
                          </button>
                        </form>
                      )}
                      {sub.status !== "PAUSED" && (
                        <form action={updateSubscriptionStatus.bind(null, sub.id, SubStatus.PAUSED)}>
                          <button type="submit" className="vp-btn text-[10px] px-2 py-1">
                            Pausar
                          </button>
                        </form>
                      )}
                      {sub.status !== "PAST_DUE" && (
                        <form action={updateSubscriptionStatus.bind(null, sub.id, SubStatus.PAST_DUE)}>
                          <button type="submit" className="vp-btn text-[10px] px-2 py-1 text-vp-warn border-vp-warn">
                            Inadimplente
                          </button>
                        </form>
                      )}
                      {sub.status !== "CANCELLED" && (
                        <form action={updateSubscriptionStatus.bind(null, sub.id, SubStatus.CANCELLED)}>
                          <button type="submit" className="vp-btn text-[10px] px-2 py-1 text-vp-urgent border-vp-urgent">
                            Cancelar
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

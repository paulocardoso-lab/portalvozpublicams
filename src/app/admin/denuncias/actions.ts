"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type TipStatus = "NEW" | "INVESTIGATING" | "PUBLISHED" | "ARCHIVED";

const STATUS_LABELS: Record<TipStatus, string> = {
  NEW: "Nova",
  INVESTIGATING: "Em investigação",
  PUBLISHED: "Publicada",
  ARCHIVED: "Arquivada",
};

async function logAudit(action: string, target: string, status: string) {
  const session = await auth();
  await prisma.auditLog.create({
    data: {
      userId: session?.user?.id ?? null,
      action,
      target,
      status,
      ip: null,
    },
  });
}

export async function updateTipStatus(id: string, status: TipStatus) {
  const tip = await prisma.tip.findUnique({ where: { id } });
  if (!tip) return;

  await prisma.tip.update({ where: { id }, data: { status } });

  // 1. Log de auditoria
  await logAudit(`TIP_STATUS_CHANGED → ${status}`, `tip:${id}`, "OK");

  // 2. E-mail ao denunciante (se tiver e-mail e status relevante)
  if (tip.email && (status === "INVESTIGATING" || status === "PUBLISHED")) {
    const isInvestigating = status === "INVESTIGATING";
    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: tip.email,
        subject: isInvestigating
          ? "Sua denúncia está sendo investigada — Voz Pública MS"
          : "Sua denúncia foi publicada — Voz Pública MS",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #1a1a19;">
            <h2 style="color: #c94a2e;">Voz Pública MS</h2>
            <p>Olá${tip.name ? `, <strong>${tip.name}</strong>` : ""},</p>
            ${isInvestigating
              ? `<p>Sua denúncia foi recebida e nossa equipe de jornalismo está <strong>investigando os fatos</strong>. Agradecemos pela confiança.</p>`
              : `<p>Sua denúncia resultou em uma <strong>matéria publicada</strong> no portal Voz Pública MS. Obrigado por ajudar a fortalecer o jornalismo independente.</p>`
            }
            <p style="color: #888; font-size: 12px; margin-top: 24px;">
              Este é um e-mail automático. Não responda a esta mensagem.<br/>
              Voz Pública MS — Jornalismo Independente
            </p>
          </div>
        `,
      });
    } catch (err) {
      // Silently fail — email is best-effort, don't break the main action
      console.error("Resend email error:", err);
    }
  }

  revalidatePath("/admin/denuncias");
}

export async function saveTipNotes(id: string, notes: string) {
  await prisma.tip.update({
    where: { id },
    data: { internalNotes: notes },
  });
  await logAudit("TIP_NOTES_UPDATED", `tip:${id}`, "OK");
  revalidatePath("/admin/denuncias");
}

export async function deleteTip(id: string) {
  await prisma.tip.delete({ where: { id } });
  await logAudit("TIP_DELETED", `tip:${id}`, "OK");
  revalidatePath("/admin/denuncias");
}

"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { EditorialAuditStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const STATUSES = new Set<EditorialAuditStatus>([
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "ARCHIVED",
]);

function clean(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function parseDate(value: FormDataEntryValue | null) {
  const text = clean(value);
  if (!text) return null;

  const [year, month, day] = text.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function parseStatus(value: FormDataEntryValue | null) {
  const status = String(value ?? "PLANNED") as EditorialAuditStatus;
  return STATUSES.has(status) ? status : "PLANNED";
}

function payloadFromForm(formData: FormData) {
  const title = clean(formData.get("title"));
  const summary = clean(formData.get("summary"));

  if (!title || !summary) {
    throw new Error("Titulo e resumo da auditoria sao obrigatorios.");
  }

  const status = parseStatus(formData.get("status"));

  return {
    title,
    scope: clean(formData.get("scope")),
    summary,
    status,
    owner: clean(formData.get("owner")),
    dueDate: parseDate(formData.get("dueDate")),
    completedAt: status === "COMPLETED" ? parseDate(formData.get("completedAt")) ?? new Date() : parseDate(formData.get("completedAt")),
    evidenceUrl: clean(formData.get("evidenceUrl")),
    findings: clean(formData.get("findings")),
    recommendations: clean(formData.get("recommendations")),
  };
}

async function logAudit(action: string, target: string, details?: Prisma.InputJsonObject) {
  const session = await auth();

  await prisma.auditLog.create({
    data: {
      userId: session?.user?.id ?? null,
      action,
      target,
      status: "OK",
      ip: null,
      details: details ?? undefined,
    },
  });
}

export async function createEditorialAudit(formData: FormData) {
  const admin = await requireAdmin();
  const data = payloadFromForm(formData);

  const audit = await prisma.editorialAudit.create({
    data: {
      ...data,
      createdById: admin.id,
      updatedById: admin.id,
    },
  });

  await logAudit("EDITORIAL_AUDIT_CREATED", `editorialAudit:${audit.id}`, { title: audit.title, status: audit.status });
  revalidatePath("/admin/auditorias");
  revalidatePath("/admin/audit");
}

export async function updateEditorialAudit(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const data = payloadFromForm(formData);

  const audit = await prisma.editorialAudit.update({
    where: { id },
    data: {
      ...data,
      updatedById: admin.id,
    },
  });

  await logAudit("EDITORIAL_AUDIT_UPDATED", `editorialAudit:${audit.id}`, { title: audit.title, status: audit.status });
  revalidatePath("/admin/auditorias");
  revalidatePath("/admin/audit");
}

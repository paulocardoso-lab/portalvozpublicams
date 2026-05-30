"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { requireSuperAdmin } from "@/lib/auth-guard";
import { SubStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function logAudit(action: string, target: string, status: string, details?: Record<string, string>) {
  const session = await auth();
  await prisma.auditLog.create({
    data: {
      userId: session?.user?.id ?? null,
      action,
      target,
      status,
      details: details ?? undefined,
      ip: null,
    },
  });
}

export async function updateSubscriptionStatus(subscriptionId: string, status: SubStatus) {
  await requireSuperAdmin();
  if (!Object.values(SubStatus).includes(status)) {
    throw new Error("Status de assinatura inválido.");
  }

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status,
      cancelledAt: status === "CANCELLED" ? new Date() : null,
    },
  });

  await logAudit("SUBSCRIPTION_STATUS_UPDATED", `subscription:${subscriptionId}`, "OK", { status });
  revalidatePath("/admin/subscriptions");
}

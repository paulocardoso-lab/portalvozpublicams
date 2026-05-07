"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type TipStatus = "NEW" | "INVESTIGATING" | "PUBLISHED" | "ARCHIVED";

export async function updateTipStatus(id: string, status: TipStatus) {
  await prisma.tip.update({ where: { id }, data: { status } });
  revalidatePath("/admin/denuncias");
}

export async function deleteTip(id: string) {
  await prisma.tip.delete({ where: { id } });
  revalidatePath("/admin/denuncias");
}

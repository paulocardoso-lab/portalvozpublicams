"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: String(formData.get("name")),
      bio: String(formData.get("bio") ?? ""),
      city: String(formData.get("city") ?? ""),
    },
  });
  revalidatePath("/admin/profile");
}

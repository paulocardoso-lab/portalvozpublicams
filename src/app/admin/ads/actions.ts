import { requireAdmin } from "@/lib/auth-guard";
import { CampaignStatus } from "@prisma/client";

export async function createCampaign(formData: FormData) {
  await requireAdmin();
  const startsAt = new Date(String(formData.get("startsAt")));
  const endsAt = new Date(String(formData.get("endsAt")));

  await prisma.campaign.create({
    data: {
      name: String(formData.get("name")),
      client: String(formData.get("client")),
      slot: String(formData.get("slot")),
      creative: String(formData.get("creative") ?? ""),
      impressions: 0,
      clicks: 0,
      startsAt,
      endsAt,
      status: "ACTIVE",
    },
  });
  revalidatePath("/admin/ads");
}

export async function updateCampaignStatus(id: string, status: CampaignStatus, _formData?: FormData) {
  await requireAdmin();
  await prisma.campaign.update({ where: { id }, data: { status } });
  revalidatePath("/admin/ads");
}

export async function deleteCampaign(id: string, _formData?: FormData) {
  await requireAdmin();
  await prisma.campaign.delete({ where: { id } });
  revalidatePath("/admin/ads");
}

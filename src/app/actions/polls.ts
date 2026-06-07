"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { PollPlacement } from "@prisma/client";

// ── Queries públicas ──────────────────────────────────────────────────────────

export async function getActivePollForSidebar() {
  const now = new Date();
  return prisma.poll.findFirst({
    where: {
      isActive: true,
      placement: { in: ["SIDEBAR", "BOTH"] },
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      AND: [
        {
          OR: [
            { maxVotes: null },
            // maxVotes não nulo: buscar onde totalVotes < maxVotes
          ],
        },
      ],
    },
    include: { options: { orderBy: { displayOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getActivePollForAboveFooter() {
  const now = new Date();
  return prisma.poll.findFirst({
    where: {
      isActive: true,
      placement: { in: ["ABOVE_FOOTER", "BOTH"] },
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    include: { options: { orderBy: { displayOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPollBySlug(slug: string) {
  return prisma.poll.findUnique({
    where: { slug },
    include: { options: { orderBy: { displayOrder: "asc" } } },
  });
}

// ── Queries admin ─────────────────────────────────────────────────────────────

export async function getPolls() {
  await requireAdmin();
  return prisma.poll.findMany({
    include: {
      options: { orderBy: { displayOrder: "asc" } },
      _count: { select: { votes: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPoll(id: string) {
  await requireAdmin();
  return prisma.poll.findUnique({
    where: { id },
    include: {
      options: { orderBy: { displayOrder: "asc" } },
      _count: { select: { votes: true } },
    },
  });
}

// ── Mutations admin ───────────────────────────────────────────────────────────

export type PollOptionInput = { label: string; displayOrder: number };

export async function createPoll(data: {
  question: string;
  slug: string;
  placement: PollPlacement;
  expiresAt?: string | null;
  maxVotes?: number | null;
  showResults: boolean;
  options: PollOptionInput[];
}) {
  await requireAdmin();

  const poll = await prisma.poll.create({
    data: {
      question: data.question,
      slug: data.slug,
      placement: data.placement,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      maxVotes: data.maxVotes ?? null,
      showResults: data.showResults,
      isActive: true,
      options: {
        create: data.options.map((o) => ({
          label: o.label,
          displayOrder: o.displayOrder,
        })),
      },
    },
  });

  revalidatePath("/admin/enquetes");
  revalidatePath("/");
  return poll;
}

export async function updatePoll(
  id: string,
  data: {
    question: string;
    slug: string;
    placement: PollPlacement;
    expiresAt?: string | null;
    maxVotes?: number | null;
    showResults: boolean;
    options: (PollOptionInput & { id?: string })[];
  }
) {
  await requireAdmin();

  // Remove opções antigas e recria — mais simples que merge parcial
  await prisma.pollOption.deleteMany({ where: { pollId: id } });

  const poll = await prisma.poll.update({
    where: { id },
    data: {
      question: data.question,
      slug: data.slug,
      placement: data.placement,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      maxVotes: data.maxVotes ?? null,
      showResults: data.showResults,
      options: {
        create: data.options.map((o) => ({
          label: o.label,
          displayOrder: o.displayOrder,
        })),
      },
    },
  });

  revalidatePath("/admin/enquetes");
  revalidatePath("/");
  return poll;
}

export async function togglePoll(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.poll.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/enquetes");
  revalidatePath("/");
}

export async function deletePoll(id: string) {
  await requireAdmin();
  await prisma.poll.delete({ where: { id } });
  revalidatePath("/admin/enquetes");
  revalidatePath("/");
}

export async function resetPollVotes(id: string) {
  await requireAdmin();
  await prisma.$transaction([
    prisma.pollVote.deleteMany({ where: { pollId: id } }),
    prisma.pollOption.updateMany({ where: { pollId: id }, data: { votes: 0 } }),
    prisma.poll.update({ where: { id }, data: { totalVotes: 0 } }),
  ]);
  revalidatePath("/admin/enquetes");
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";
import { auth } from "@/auth";

const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h
const RATE_LIMIT_MAX_VOTES = 10; // por IP em 24h, em todas as enquetes

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function buildFingerprint(ip: string, ua: string, pollId: string): string {
  return createHash("sha256").update(`${ip}|${ua}|${pollId}`).digest("hex");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pollId: string }> }
) {
  const { pollId } = await params;
  const ip = getIp(req);
  const ua = req.headers.get("user-agent") ?? "";

  // 1. Camada: cookie de sessão (leitura — escrita feita no cliente via Set-Cookie)
  const cookieKey = `pvp_poll_${pollId}`;
  if (req.cookies.get(cookieKey)) {
    return NextResponse.json({ error: "already_voted" }, { status: 409 });
  }

  let body: { optionId: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { optionId } = body;
  if (!optionId) {
    return NextResponse.json({ error: "missing_option" }, { status: 400 });
  }

  // Valida enquete
  const now = new Date();
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { options: true },
  });

  if (!poll || !poll.isActive) {
    return NextResponse.json({ error: "poll_not_found" }, { status: 404 });
  }
  if (poll.expiresAt && poll.expiresAt < now) {
    return NextResponse.json({ error: "poll_expired" }, { status: 410 });
  }
  if (poll.maxVotes !== null && poll.totalVotes >= poll.maxVotes) {
    return NextResponse.json({ error: "poll_full" }, { status: 410 });
  }

  const option = poll.options.find((o) => o.id === optionId);
  if (!option) {
    return NextResponse.json({ error: "invalid_option" }, { status: 400 });
  }

  // 2. Camada: rate-limit por IP (24h, todas as enquetes)
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);
  const recentVotes = await prisma.pollVote.count({
    where: { ip, createdAt: { gte: windowStart } },
  });
  if (recentVotes >= RATE_LIMIT_MAX_VOTES) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // 3. Camada: fingerprint único (IP + UA + pollId)
  const fingerprint = buildFingerprint(ip, ua, pollId);

  // Usuário logado (opcional — reforça deduplicação)
  const session = await auth();
  const userId = session?.user?.id ?? null;

  try {
    await prisma.$transaction([
      prisma.pollVote.create({
        data: { pollId, optionId, fingerprint, ip, userId },
      }),
      prisma.$executeRaw`UPDATE "PollOption" SET votes = votes + 1 WHERE id = ${optionId}`,
      prisma.$executeRaw`UPDATE "Poll" SET "totalVotes" = "totalVotes" + 1 WHERE id = ${pollId}`,
    ]);
  } catch (err: unknown) {
    // unique constraint violation = fingerprint duplicado
    if (
      err instanceof Error &&
      err.message.includes("Unique constraint")
    ) {
      return NextResponse.json({ error: "already_voted" }, { status: 409 });
    }
    console.error("[poll/vote]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  // Busca resultado atualizado
  const updatedPoll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { options: { orderBy: { displayOrder: "asc" } } },
  });

  const res = NextResponse.json({ success: true, poll: updatedPoll });

  // Set-Cookie anti-bot (7 dias, httpOnly)
  res.cookies.set(cookieKey, "1", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return res;
}

// Retorna dados da enquete (GET público)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pollId: string }> }
) {
  const { pollId } = await params;
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { options: { orderBy: { displayOrder: "asc" } } },
  });
  if (!poll) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ poll });
}

import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { rateLimitRequest } from '@/lib/rate-limit';

const subscribeSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const limit = rateLimitRequest(req, { key: 'newsletter-api', limit: 5, windowMs: 10 * 60 * 1000 });
  if (limit.limited) {
    return NextResponse.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': String(limit.retryAfter ?? 60) }
    });
  }

  try {
    const body = await req.json();
    const { email } = subscribeSchema.parse(body);

    // Get or create newsletter
    const newsletter = await prisma.newsletter.upsert({
      where: { slug: 'a-semana-em-ms' },
      update: {},
      create: {
        name: 'A Semana em MS',
        slug: 'a-semana-em-ms',
        description: 'O resumo do que importou em Mato Grosso do Sul.',
      }
    });

    // Add subscriber
    await prisma.newsletterSubscriber.upsert({
      where: {
        email_newsletterId: {
          email,
          newsletterId: newsletter.id
        }
      },
      update: {}, // if already subscribed, do nothing
      create: {
        email,
        newsletterId: newsletter.id,
      }
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

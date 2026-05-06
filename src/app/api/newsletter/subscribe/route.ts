import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const subscribeSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
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

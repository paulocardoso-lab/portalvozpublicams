import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

import { Plan } from '@prisma/client';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-02-24-preview' as any }) : null;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    if (!endpointSecret) throw new Error('Missing STRIPE_WEBHOOK_SECRET');
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook Error: ${message}`);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSession(session);
      break;
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(subscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan as Plan;

  if (!userId) return;

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      status: 'ACTIVE',
      plan: plan || 'READER',
      externalId: session.subscription as string,
    },
    create: {
      userId,
      plan: plan || 'READER',
      amount: session.amount_total || 0,
      status: 'ACTIVE',
      method: 'CARD',
      externalId: session.subscription as string,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { externalId: subscription.id },
    data: {
      status: 'CANCELLED',
      cancelledAt: new Date(),
    },
  });
}

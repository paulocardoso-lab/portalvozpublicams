import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { z } from 'zod';
import { subscribeToNewsletter } from '@/app/actions/newsletter';
import { rateLimitRequest } from '@/lib/rate-limit';

const subscribeSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const limit = rateLimitRequest(req, { key: 'newsletter-api', limit: 5, windowMs: 10 * 60 * 1000 });
  if (limit.limited) {
    return NextResponse.json({ error: 'Too many requests' }, {
      status: 429,
      headers: { 'Retry-After': String(limit.retryAfter ?? 60) },
    });
  }

  try {
    const body = await req.json();
    const { email } = subscribeSchema.parse(body);

    const formData = new FormData();
    formData.set('email', email);
    const result = await subscribeToNewsletter(formData);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: result.message });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

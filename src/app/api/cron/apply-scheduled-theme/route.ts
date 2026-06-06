import { NextResponse } from 'next/server';
import { applyDueScheduledThemes } from '@/app/actions/design-tokens';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null;

  if (process.env.NODE_ENV === 'production' && (!expected || authHeader !== expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const applied = await applyDueScheduledThemes();
    return NextResponse.json({ ok: true, applied });
  } catch (err) {
    console.error('apply-scheduled-theme cron error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdminRole } from '@/lib/auth-guard';
import { fetchJsonIndicatorValue } from '@/lib/market-indicators';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isAdminRole(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json() as {
      sourceUrl?: string;
      sourcePath?: string;
      sourceHeaders?: string;
      formatDecimals?: number;
      prefix?: string;
      suffix?: string;
    };

    const result = await fetchJsonIndicatorValue({
      sourceUrl: body.sourceUrl ?? null,
      sourcePath: body.sourcePath ?? null,
      sourceHeaders: body.sourceHeaders ?? null,
      formatDecimals: body.formatDecimals ?? 2,
      prefix: body.prefix ?? null,
      suffix: body.suffix ?? null,
    });

    return NextResponse.json({
      success: true,
      rawValue: result.rawValue,
      value: result.value,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Não foi possível testar a fonte.',
    }, { status: 400 });
  }
}

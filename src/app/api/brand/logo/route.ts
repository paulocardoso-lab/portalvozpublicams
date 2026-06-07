import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'BRAND_LOGO_URL' },
      select: { value: true },
    });

    const logoUrl = setting?.value?.trim() || '/logo.webp';
    return NextResponse.redirect(new URL(logoUrl, request.url));
  } catch {
    return NextResponse.redirect(new URL('/logo.webp', request.url));
  }
}

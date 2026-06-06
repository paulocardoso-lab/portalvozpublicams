import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Serve the dynamic favicon from Supabase brand bucket.
// Falls back to /favicon.png (static) if no custom favicon is set.
export async function GET(request: Request) {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'BRAND_FAVICON_URL' },
    });

    if (setting?.value) {
      return NextResponse.redirect(setting.value, {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      });
    }
  } catch {
    // fall through to static
  }

  return NextResponse.redirect(new URL('/favicon.png', request.url));
}

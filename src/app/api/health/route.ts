import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Test DB connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      env: {
        has_db_url: !!process.env.DATABASE_URL,
        has_auth_secret: !!process.env.AUTH_SECRET,
        node_env: process.env.NODE_ENV
      }
    });
  } catch (err: any) {
    console.error('Health Check Failed:', err);
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      message: err.message,
      code: err.code,
      meta: err.meta,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

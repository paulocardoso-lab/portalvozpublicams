import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ? `${process.env.AUTH_GOOGLE_ID.substring(0, 10)}...` : 'MISSING',
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET ? 'PRESENT' : 'MISSING',
    RESEND_API_KEY: process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 5)}...` : 'MISSING',
    AUTH_SECRET: process.env.AUTH_SECRET ? 'PRESENT' : 'MISSING',
    DATABASE_URL: process.env.DATABASE_URL ? 'PRESENT' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV,
  });
}

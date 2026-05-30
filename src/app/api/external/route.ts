import { NextResponse } from 'next/server';
import { getMarketData, getWeatherData } from '@/lib/external-data';

export async function GET() {
  try {
    const [market, weather] = await Promise.all([
      getMarketData(),
      getWeatherData()
    ]);
    
    return NextResponse.json({ market, weather });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

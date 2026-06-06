import { NextResponse } from 'next/server';
import { getHeaderIndicators, getMarketData, getWeatherData } from '@/lib/external-data';

export async function GET() {
  try {
    const [market, weather, indicators] = await Promise.all([
      getMarketData(),
      getWeatherData(),
      getHeaderIndicators(),
    ]);
    
    return NextResponse.json({ market, weather, indicators });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

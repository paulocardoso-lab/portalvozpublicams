import prisma from './prisma';
import { toHeaderIndicator } from './market-indicators';

export async function getMarketData() {
  try {
    // Tenta buscar do banco primeiro (Cache persistente)
    const indicators = await prisma.marketIndicator.findMany({
      where: { key: { in: ['usd', 'boi', 'soja', 'milho', 'trigo'] } }
    });

    const dataMap = indicators.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return {
      usd: dataMap.usd || "",
      boi: dataMap.boi || "",
      soja: dataMap.soja || "",
      milho: dataMap.milho || "",
      trigo: dataMap.trigo || ""
    };
  } catch (error) {
    console.error('Erro ao buscar dados financeiros:', error);
    return { usd: "", boi: "", soja: "", milho: "", trigo: "" };
  }
}

export async function getHeaderIndicators() {
  try {
    const indicators = await prisma.marketIndicator.findMany({
      where: {
        isActive: true,
        showInHeader: true,
      },
      orderBy: [
        { displayOrder: 'asc' },
        { key: 'asc' },
      ],
    });

    return indicators.map(toHeaderIndicator).filter((indicator) => indicator.value.trim().length > 0);
  } catch (error) {
    console.error('Erro ao buscar indicadores do cabeçalho:', error);
    return [];
  }
}

export async function getWeatherData() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-20.4428&longitude=-54.6464&current_weather=true', {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    return {
      temp: Math.round(data.current_weather.temperature)
    };
  } catch (error) {
    console.error('Erro ao buscar dados de clima:', error);
    return { temp: null };
  }
}

export async function getNewsletterStats() {
  try {
    return await prisma.newsletterSubscriber.count();
  } catch (error) {
    console.error('Erro ao buscar inscritos:', error);
    return 0;
  }
}

export async function getCommentStats() {
  try {
    return await prisma.comment.count();
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return 0;
  }
}

export async function getActiveCampaign(slot: string) {
  try {
    const now = new Date();
    return await prisma.campaign.findFirst({
      where: {
        slot,
        status: 'ACTIVE',
        startsAt: { lte: now },
        endsAt: { gte: now }
      },
      orderBy: { impressions: 'asc' } // Rotatividade básica
    });
  } catch (error) {
    console.error('Erro ao buscar campanha:', error);
    return null;
  }
}

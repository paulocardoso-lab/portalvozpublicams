import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * CRON: Atualiza indicadores de mercado (Dólar, Boi, Soja, Milho, Trigo)
 * Scrape realizado via Notícias Agrícolas por ser mais estável para bots.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: Record<string, string | null> = { 
    usd: null, 
    boi: null, 
    soja: null, 
    milho: null,
    trigo: null
  };

  try {
    const res = await fetch('https://www.noticiasagricolas.com.br/cotacoes/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
      cache: 'no-store'
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    // 1. Dólar (Extraído do box de destaque no topo)
    const usdRaw = $('.box-dolar .valor').first().text();
    if (usdRaw) {
      results.usd = usdRaw.replace('R$', '').trim().replace(',', '.');
    }

    // 2. Indicadores Agrícolas (Extraídos dos boxes "mercado-fisico")
    $('.box').each((_, el) => {
      const box = $(el);
      const title = box.find('h2').text();
      
      // Boi Gordo (Prioriza Cepea ou AgroBrazil)
      if (title.includes('Boi Gordo') && !results.boi) {
        const val = box.find('.cot-fisicas tbody tr:first-child td:nth-child(2)').text().trim();
        if (val) results.boi = val;
      }
      
      // Soja (Prioriza Paranaguá ou Cepea)
      if (title.includes('Soja') && (title.includes('Paraná') || title.includes('Cepea')) && !results.soja) {
        const val = box.find('.cot-fisicas tbody tr:first-child td:nth-child(2)').text().trim();
        if (val) results.soja = val;
      }

      // Milho (Prioriza Esalq/B3)
      if (title.includes('Milho') && (title.includes('Esalq') || title.includes('B3')) && !results.milho) {
        const val = box.find('.cot-fisicas tbody tr:first-child td:nth-child(2)').text().trim();
        if (val) results.milho = val;
      }

      // Trigo
      if (title.includes('Trigo') && !results.trigo) {
        const val = box.find('.cot-fisicas tbody tr:first-child td:nth-child(2)').text().trim();
        if (val) results.trigo = val;
      }
    });

    // Persistência no Banco de Dados
    const updates = Object.entries(results).map(async ([key, value]) => {
      if (value) {
        return prisma.marketIndicator.upsert({
          where: { key },
          update: { 
            value: value,
            updatedAt: new Date()
          },
          create: { 
            key, 
            value: value, 
            unit: key === 'usd' ? 'R$' : key === 'boi' ? 'R$/@' : 'R$/sc'
          }
        });
      }
    });

    await Promise.all(updates);

    return NextResponse.json({ success: true, results, timestamp: new Date() });
  } catch (error) {
    console.error('Erro no CRON de indicadores:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

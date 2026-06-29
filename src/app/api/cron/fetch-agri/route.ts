import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';
import { fetchJsonIndicatorValue } from '@/lib/market-indicators';
import { isMarketIndicatorStale } from '@/lib/market-indicator-health';
import { sendEmail, alertRecipient } from '@/lib/send-email';
import { marketIndicatorAlertTemplate } from '@/lib/email-templates';

export const dynamic = 'force-dynamic';

/**
 * CRON: Atualiza indicadores de mercado (Dólar, Boi, Soja, Milho, Trigo)
 * AgroDoc AI é fonte primária para boi/soja/milho; Notícias Agrícolas fica como fallback
 * e fonte complementar para dólar/trigo.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null;

  if (process.env.NODE_ENV === 'production' && (!expected || authHeader !== expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: Record<string, string | null> = {
    usd: null, 
    boi: null, 
    soja: null, 
    milho: null,
    trigo: null
  };

  const sources: string[] = [];
  const warnings: string[] = [];

  const formatMarketValue = (value: unknown) => {
    const numeric = typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value.replace(',', '.'))
        : Number.NaN;

    if (!Number.isFinite(numeric)) return null;
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numeric);
  };

  const unitFor = (key: string) => {
    if (key === 'usd') return 'R$';
    if (key === 'boi') return 'R$/@';
    if (key === 'trigo') return 'R$/t';
    return 'R$/sc';
  };

  try {
    const res = await fetch('https://agrodocai.com.br/api/v1/cotacao', {
      headers: { 'User-Agent': 'VozPublicaMS/1.0 (+https://sitevozpublicamsoficial-git-main-paulocardoso-labs-projects.vercel.app)' },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as {
      boi_gordo_cepea_sp?: unknown;
      soja?: unknown;
      milho?: unknown;
      fonte?: string;
      atualizado?: string;
    };

    results.boi = formatMarketValue(data.boi_gordo_cepea_sp);
    results.soja = formatMarketValue(data.soja);
    results.milho = formatMarketValue(data.milho);
    sources.push(`AgroDoc AI${data.fonte ? ` (${data.fonte})` : ''}${data.atualizado ? ` @ ${data.atualizado}` : ''}`);
  } catch (error) {
    warnings.push(`AgroDoc AI indisponível: ${error instanceof Error ? error.message : 'erro desconhecido'}`);
  }

  try {
    const res = await fetch('https://www.noticiasagricolas.com.br/cotacoes/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    sources.push('Notícias Agrícolas');

    const usdRaw = $('.box-dolar .valor').first().text();
    if (usdRaw) {
      results.usd = usdRaw.replace('R$', '').trim();
    }

    // Fallbacks agrícolas, usados somente se a API primária não retornou valor.
    $('.box').each((_, el) => {
      const box = $(el);
      const title = box.find('h2').text();
      
      if (title.includes('Boi Gordo') && !results.boi) {
        const val = box.find('.cot-fisicas tbody tr:first-child td:nth-child(2)').text().trim();
        if (val) results.boi = val;
      }
      
      if (title.includes('Soja') && (title.includes('Paraná') || title.includes('Cepea')) && !results.soja) {
        const val = box.find('.cot-fisicas tbody tr:first-child td:nth-child(2)').text().trim();
        if (val) results.soja = val;
      }

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
  } catch (error) {
    warnings.push(`Notícias Agrícolas indisponível: ${error instanceof Error ? error.message : 'erro desconhecido'}`);
  }

  try {
    const fetchedAt = new Date();
    const updates = Object.entries(results).map(async ([key, value]) => {
      if (value) {
        return prisma.marketIndicator.upsert({
          where: { key },
          update: { 
            value: value,
            unit: unitFor(key),
            sourceType: 'SYSTEM',
            lastFetchStatus: 'OK',
            lastFetchError: null,
            lastFetchedAt: fetchedAt,
            updatedAt: new Date()
          },
          create: { 
            key, 
            label: key.toUpperCase(),
            value: value, 
            unit: unitFor(key),
            sourceType: 'SYSTEM',
            showInHeader: ['usd', 'boi', 'soja', 'milho'].includes(key),
            showInMobile: ['usd', 'boi'].includes(key),
            lastFetchStatus: 'OK',
            lastFetchedAt: fetchedAt,
          }
        });
      }
    });

    await Promise.all(updates);

    const customIndicators = await prisma.marketIndicator.findMany({
      where: {
        isActive: true,
        sourceType: 'JSON_API',
        sourceUrl: { not: null },
      },
    });

    for (const indicator of customIndicators) {
      const lastFetched = indicator.lastFetchedAt?.getTime() ?? 0;
      const intervalMs = Math.max(5, indicator.sourceRefreshMinutes) * 60 * 1000;
      if (lastFetched > 0 && Date.now() - lastFetched < intervalMs) continue;

      try {
        const result = await fetchJsonIndicatorValue(indicator);
        await prisma.marketIndicator.update({
          where: { key: indicator.key },
          data: {
            value: result.value,
            lastFetchStatus: 'OK',
            lastFetchError: null,
            lastFetchedAt: new Date(),
          },
        });
        results[indicator.key] = result.value;
        sources.push(`JSON API: ${indicator.label || indicator.key}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'erro desconhecido';
        await prisma.marketIndicator.update({
          where: { key: indicator.key },
          data: {
            lastFetchStatus: 'ERROR',
            lastFetchError: message,
            lastFetchedAt: new Date(),
          },
        });
        warnings.push(`Indicador ${indicator.key}: ${message}`);
      }
    }

    const updatedKeys = Object.entries(results)
      .filter(([, value]) => Boolean(value))
      .map(([key]) => key);

    if (updatedKeys.length === 0) {
      return NextResponse.json({ success: false, results, warnings, error: 'Nenhum indicador foi atualizado.' }, { status: 502 });
    }

    // Check for stale indicators after this run and send alert if any found
    try {
      const allIndicators = await prisma.marketIndicator.findMany({
        where: { isActive: true, sourceType: { not: 'MANUAL' } },
        select: { key: true, label: true, sourceType: true, sourceRefreshMinutes: true, lastFetchedAt: true, lastFetchError: true },
      });

      const stale = allIndicators.filter((ind) => isMarketIndicatorStale(ind));

      if (stale.length > 0) {
        await sendEmail({
          to: alertRecipient(),
          subject: `[Voz Pública MS] Alerta: ${stale.length} indicador(es) de mercado desatualizado(s)`,
          html: marketIndicatorAlertTemplate(
            stale.map((ind) => ({
              key: ind.key,
              label: ind.label ?? ind.key.toUpperCase(),
              lastFetchedAt: ind.lastFetchedAt,
              lastFetchError: ind.lastFetchError,
            })),
            warnings
          ),
        });
      }
    } catch (alertErr) {
      console.error('[fetch-agri] falha ao enviar alerta de indicadores:', alertErr);
    }

    return NextResponse.json({
      success: true,
      results,
      updatedKeys,
      sources,
      warnings,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Erro no CRON de indicadores:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

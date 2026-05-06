import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verificação básica de segurança (token opcional na URL para evitar disparos manuais excessivos)
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: { boi: string | null; soja: string | null } = { boi: null, soja: null };

  try {
    // 1. Scrape Boi Gordo via Notícias Agrícolas (mais amigável a bots que o CEPEA direto)
    const boiRes = await fetch('https://www.noticiasagricolas.com.br/cotacoes/boi-gordo/cepea-boi-gordo', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    const boiHtml = await boiRes.text();
    const $boi = cheerio.load(boiHtml);
    // Tenta pegar o primeiro valor da tabela de cotações
    const boiValue = $boi('.cot-fisicas .valor').first().text().trim();
    if (boiValue) {
      results.boi = boiValue;
      await prisma.marketIndicator.upsert({
        where: { key: 'boi' },
        update: { value: boiValue },
        create: { key: 'boi', value: boiValue, unit: 'R$/@' }
      });
    }

    // 2. Scrape Soja via Notícias Agrícolas
    const sojaRes = await fetch('https://www.noticiasagricolas.com.br/cotacoes/soja/soja-cepea-esalq-parana', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    const sojaHtml = await sojaRes.text();
    const $soja = cheerio.load(sojaHtml);
    const sojaValue = $soja('.cot-fisicas .valor').first().text().trim();
    if (sojaValue) {
      results.soja = sojaValue;
      await prisma.marketIndicator.upsert({
        where: { key: 'soja' },
        update: { value: sojaValue },
        create: { key: 'soja', value: sojaValue, unit: 'R$/sc' }
      });
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Erro no CRON de agricultura:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

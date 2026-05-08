import 'dotenv/config';
import prisma from '../lib/prisma';
import { syncFeed } from '../lib/rss-engine';

async function main() {
  console.log('--- Iniciando Sincronização de Teste ---');
  
  // 1. Garantir que temos uma editoria de Política
  let section = await prisma.section.findFirst({
    where: { name: { contains: 'Polí', mode: 'insensitive' } }
  });

  if (!section) {
    console.log('Criando editoria de Política...');
    section = await prisma.section.create({
      data: {
        name: 'Política',
        slug: 'politica'
      }
    });
  }

  // 2. Cadastrar o Feed do Google News
  const feedUrl = 'https://news.google.com/rss/search?q=Pol%C3%ADtica+Mato+Grosso+do+Sul&hl=pt-BR&gl=BR&ceid=BR:pt-150';
  
  const feed = await prisma.rSSFeed.upsert({
    where: { url: feedUrl },
    update: { isActive: true },
    create: {
      name: 'Google News - Política MS',
      url: feedUrl,
      targetSectionId: section.id,
      autoPublish: true
    }
  });

  console.log(`Feed cadastrado: ${feed.name}`);
  console.log('Iniciando sincronização...');

  await syncFeed(feed.id);
  
  console.log('Sincronização concluída!');
}

main().catch(console.error);

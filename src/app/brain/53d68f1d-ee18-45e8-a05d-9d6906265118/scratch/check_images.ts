import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      heroImage: true,
      status: true
    }
  });
  console.log(JSON.stringify(articles, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

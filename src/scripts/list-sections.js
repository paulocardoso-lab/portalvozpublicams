const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const sections = await prisma.section.findMany({ 
      select: { id: true, name: true },
      take: 5 
    });
    console.log(JSON.stringify(sections, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

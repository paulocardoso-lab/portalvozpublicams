import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    console.log("Checking DB connection...");
    const count = await prisma.rSSFeed.count();
    console.log(`Connected. Total RSS feeds: ${count}`);
    
    const sections = await prisma.section.findMany({ select: { id: true, name: true } });
    console.log(`Sections found: ${sections.length}`);
    if (sections.length === 0) {
      console.warn("WARNING: No sections found. RSS feed creation might fail if a section is required.");
    }

    // Try a test creation (dry run in transaction then rollback if possible, or just check constraints)
    console.log("DB Schema check complete.");
  } catch (error) {
    console.error("DB Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

import { PrismaClient } from '@prisma/client'
import "dotenv/config";

const prisma = new PrismaClient()

async function main() {
  console.log('Testing connection...')
  const count = await prisma.section.count()
  console.log('Sections count:', count)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

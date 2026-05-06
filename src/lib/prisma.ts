import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = 
  globalForPrisma.prisma || 
  (process.env.NEXT_PHASE === 'phase-production-build' 
    ? null as unknown as PrismaClient 
    : new PrismaClient())

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma

import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const prismaClientSingleton = () => {
  // Verificação de segurança para Build e Ambiente sem DB
  if (process.env.NEXT_PHASE === 'phase-production-build' || !process.env.DATABASE_URL) {
    const createSafeProxy = (path: string = ''): any => {
      const proxy = new Proxy(() => {}, {
        get: (target, prop) => {
          if (prop === 'then' || prop === 'catch' || prop === 'finally' || typeof prop === 'symbol') return undefined;
          return createSafeProxy(`${path}.${String(prop)}`);
        },
        apply: (target, thisArg, args) => {
          if (path.toLowerCase().includes('many') || path.toLowerCase().includes('find')) return Promise.resolve([]);
          return Promise.resolve(null);
        }
      });
      return proxy;
    };
    return createSafeProxy('prisma') as PrismaClient;
  }
  
  // No Prisma 7, é necessário configurar explicitamente o adaptador ou a URL no construtor
  // quando ela não está presente no schema.prisma
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

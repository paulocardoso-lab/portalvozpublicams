import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
  // Se estivermos em build ou sem URL de banco, retornamos um objeto vazio
  // para evitar que o Next.js trave a compilação de páginas estáticas
  if (process.env.NEXT_PHASE === 'phase-production-build' || !process.env.DATABASE_URL) {
    return {} as PrismaClient;
  }
  return new PrismaClient()
}

declare const globalThis: {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (!globalThis.prisma || Object.keys(globalThis.prisma).length === 0) {
      globalThis.prisma = prismaClientSingleton()
    }
    const value = Reflect.get(globalThis.prisma, prop, receiver)
    if (typeof value === 'function') {
      return value.bind(globalThis.prisma)
    }
    return value
  }
})

export default prisma

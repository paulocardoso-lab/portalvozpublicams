import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import authConfig from "./auth.config"

// Durante o build ou sem banco, desativamos o adaptador para evitar crash de inicialização
const adapter = (process.env.NEXT_PHASE === 'phase-production-build' || !process.env.DATABASE_URL)
  ? undefined
  : PrismaAdapter(prisma);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  session: { strategy: "jwt" },
  trustHost: true,
  ...authConfig,
})

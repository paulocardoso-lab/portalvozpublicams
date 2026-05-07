import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import "dotenv/config"

async function test() {
  const variations = [
    process.env.DATABASE_URL,
    "postgresql://postgres:hSuT%2AbuE.Bw.KV6@db.ofixwqrjjjrhtgfifhzl.supabase.co:5432/postgres",
    "postgresql://postgres:hSuT%2AbuE.Bw.KV6@db.ofixwqrjjjrhtgfifhzl.supabase.co:6543/postgres?pgbouncer=true"
  ]
  
  for (const connectionString of variations) {
    if (!connectionString) continue;
    console.log('\n--- Testing variation ---')
    
    try {
      const pool = new Pool({ connectionString })
      const adapter = new PrismaPg(pool)
      const prisma = new PrismaClient({ adapter })
      
      const settings = await prisma.siteSetting.findMany({ take: 1 })
      console.log('Successfully fetched settings:', settings.length)
      await prisma.$disconnect()
    } catch (err) {
      console.error('Connection failed:', err)
    }
  }
}

test()

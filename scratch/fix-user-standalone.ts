import { PrismaClient } from "@prisma/client";

const DATABASE_URL = "postgresql://postgres.ofixwqrjjjrhtgfifhzl:hSuT*buE.Bw.KV6@aws-1-sa-east-1.pooler.supabase.com:6543/postgres";

// We don't use the adapter here to see if it works with standard Prisma
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function main() {
  const email = "paulofernandogarciacardoso@gmail.com";
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (user) {
      console.log("User found:", user.email, "Role:", user.role);
      
      if (user.role !== "SUPER_ADMIN") {
        console.log("Updating user role to SUPER_ADMIN...");
        const updated = await prisma.user.update({
          where: { email },
          data: { role: "SUPER_ADMIN" },
        });
        console.log("User updated successfully! New Role:", updated.role);
      } else {
        console.log("User already has SUPER_ADMIN role.");
      }
    } else {
      console.log(`User with email ${email} NOT found.`);
      // List some users to see what's there
      const allUsers = await prisma.user.findMany({ take: 5 });
      console.log("Other users in DB:");
      allUsers.forEach(u => console.log(` - ${u.email} (${u.role})`));
    }
  } catch (err) {
    console.error("Database error:", err);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

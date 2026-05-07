import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { prisma } from "../src/lib/prisma";

async function main() {
  const email = "paulofernandogarciacardoso@gmail.com";
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (user) {
      console.log("User found:");
      console.log(JSON.stringify(user, null, 2));
      
      if (user.role !== "SUPER_ADMIN") {
        console.log("Updating user role to SUPER_ADMIN...");
        const updated = await prisma.user.update({
          where: { email },
          data: { role: "SUPER_ADMIN" },
        });
        console.log("User updated successfully:");
        console.log(JSON.stringify(updated, null, 2));
      } else {
        console.log("User already has SUPER_ADMIN role.");
      }
    } else {
      console.log(`User with email ${email} NOT found.`);
      // List some users to see what's there
      const allUsers = await prisma.user.findMany({ take: 5 });
      console.log("Other users in DB:");
      console.table(allUsers.map(u => ({ email: u.email, role: u.role })));
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

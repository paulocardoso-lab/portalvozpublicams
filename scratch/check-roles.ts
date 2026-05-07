import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import prisma from "../src/lib/prisma";

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
      },
      take: 10,
    });
    console.log("Users and Roles:");
    console.table(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
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

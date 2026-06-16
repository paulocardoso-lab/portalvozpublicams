const { spawnSync } = require("node:child_process");

const directUrl = process.env.DIRECT_URL;

if (directUrl) {
  process.env.DATABASE_URL = directUrl;
} else if (process.env.VERCEL) {
  console.error("DIRECT_URL is required for Prisma migrations on Vercel.");
  process.exit(1);
}

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(command, ["prisma", "migrate", "deploy"], {
  env: process.env,
  stdio: "inherit",
});

process.exit(result.status ?? 1);

require("dotenv/config");

const { spawnSync } = require("node:child_process");

function getMigrationUrl() {
  if (process.env.MIGRATE_DATABASE_URL) return process.env.MIGRATE_DATABASE_URL;

  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      const url = new URL(databaseUrl);
      if (url.hostname.includes("pooler.supabase.com") && url.port === "6543") {
        return databaseUrl.replace(":6543/", ":5432/");
      }
    } catch {
      return databaseUrl;
    }
  }

  return process.env.DIRECT_URL ?? databaseUrl;
}

const migrationUrl = getMigrationUrl();

if (!migrationUrl) {
  console.error("DATABASE_URL is required for Prisma migrations.");
  process.exit(1);
}

process.env.DATABASE_URL = migrationUrl;

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(command, ["prisma", "migrate", "deploy"], {
  env: process.env,
  shell: process.platform === "win32",
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
}

process.exit(result.status ?? 1);

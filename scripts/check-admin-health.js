const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

for (const file of [".env.local", ".env"]) {
  const envPath = path.join(process.cwd(), file);
  if (!fs.existsSync(envPath)) continue;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    if (!key || process.env[key]) continue;

    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

const checks = [
  {
    name: "DATABASE_URL",
    run: async () => Boolean(process.env.DATABASE_URL),
    hint: "Configure DATABASE_URL para consultas administrativas.",
  },
  {
    name: "Auth secret",
    run: async () => Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
    hint: "Configure AUTH_SECRET ou NEXTAUTH_SECRET.",
  },
  {
    name: "RSS setting",
    run: async () => {
      const result = await getPool().query('SELECT "value" FROM "SiteSetting" WHERE "key" = $1 LIMIT 1', ["ENABLE_RSS"]);
      return result.rows[0]?.value === "true";
    },
    hint: "Ative Automação RSS em /admin/settings quando quiser o cron capturando feeds.",
    optional: true,
  },
  {
    name: "Base admin data",
    run: async () => {
      const [sections, users] = await Promise.all([
        getPool().query('SELECT COUNT(*)::int AS count FROM "Section"'),
        getPool().query('SELECT COUNT(*)::int AS count FROM "User" WHERE "status" = $1 AND "role" <> $2', [
          "ACTIVE",
          "READER",
        ]),
      ]);
      return sections.rows[0].count > 0 && users.rows[0].count > 0;
    },
    hint: "Garanta pelo menos uma editoria e um usuário administrativo ativo.",
  },
  {
    name: "Cron secret",
    run: async () => process.env.NODE_ENV !== "production" || Boolean(process.env.CRON_SECRET),
    hint: "Configure CRON_SECRET em produção.",
  },
  {
    name: "Optional integrations",
    run: async () => ({
      resend: Boolean(process.env.RESEND_API_KEY),
      gemini: Boolean(process.env.GOOGLE_GEMINI_API_KEY),
      supabaseStorage: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      ),
    }),
    hint: "Integrações opcionais podem ficar pendentes sem bloquear o admin.",
    optional: true,
  },
];

(async () => {
  let hasFailure = false;

  for (const check of checks) {
    try {
      const result = await check.run();
      const ok = typeof result === "object" ? Object.values(result).every(Boolean) : Boolean(result);
      const label = ok ? "PASS" : check.optional ? "WARN" : "FAIL";
      console.log(`${label} ${check.name}`);

      if (typeof result === "object") {
        for (const [key, value] of Object.entries(result)) {
          console.log(`  - ${key}: ${value ? "configured" : "pending"}`);
        }
      }

      if (!ok) {
        console.log(`  - ${check.hint}`);
        if (!check.optional) hasFailure = true;
      }
    } catch (error) {
      console.log(`FAIL ${check.name}`);
      console.log(`  - ${error instanceof Error ? error.message : "Erro desconhecido"}`);
      if (!check.optional) hasFailure = true;
    }
  }

  if (pool) await pool.end();
  if (hasFailure) process.exitCode = 1;
})().catch(async (error) => {
  console.error(error);
  if (pool) await pool.end();
  process.exit(1);
});

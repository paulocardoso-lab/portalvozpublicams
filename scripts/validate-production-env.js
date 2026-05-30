const fs = require("fs");
const path = require("path");

function loadEnvFile(fileName, { override = false } = {}) {
  const envPath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");
    if (override || !process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local", { override: true });

const isProductionRuntime =
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL === "1" ||
  process.env.CI === "true" ||
  process.argv.includes("--production");

function isLocalUrl(value) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/.test(value);
}

const required = [
  "DATABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const recommended = [
  "NEXTAUTH_URL",
  "AUTH_SECRET",
  "NEXTAUTH_SECRET",
  "SUPABASE_SERVICE_ROLE_KEY",
  "GOOGLE_GEMINI_API_KEY",
];

const failures = [];
const warnings = [];

for (const key of required) {
  if (!process.env[key]) failures.push(`${key} is required.`);
}

if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  failures.push("AUTH_SECRET or NEXTAUTH_SECRET is required for production auth.");
}

if (isProductionRuntime && !process.env.CRON_SECRET) {
  failures.push("CRON_SECRET is required in production.");
}

if (process.env.CRON_SECRET && process.env.CRON_SECRET.length < 32) {
  warnings.push("CRON_SECRET should be at least 32 characters.");
}

if (
  isProductionRuntime &&
  process.env.NEXTAUTH_URL &&
  !/^https:\/\//.test(process.env.NEXTAUTH_URL) &&
  !isLocalUrl(process.env.NEXTAUTH_URL)
) {
  warnings.push("NEXTAUTH_URL should use https:// in production.");
}

if (process.env.NEXT_PUBLIC_SUPABASE_URL && !/^https:\/\/.+\.supabase\.co$/.test(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
  warnings.push("NEXT_PUBLIC_SUPABASE_URL is not a standard https://*.supabase.co URL.");
}

if ((process.env.STRIPE_SECRET_KEY || process.env.STRIPE_WEBHOOK_SECRET) && !(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET)) {
  failures.push("STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET must be configured together.");
}

for (const key of recommended) {
  if (!process.env[key]) warnings.push(`${key} is not set.`);
}

if (isProductionRuntime) {
  for (const key of ["EMAIL_FROM", "NEXT_PUBLIC_GA_ID"]) {
    if (!process.env[key]) warnings.push(`${key} is not set.`);
  }
}

if (isProductionRuntime && (process.env.RESEND_API_KEY || process.env.AUTH_RESEND_KEY) && !process.env.EMAIL_FROM) {
  warnings.push("EMAIL_FROM is not set, so transactional email sender identity is incomplete.");
}

if (process.env.NEXT_PUBLIC_UMAMI_SRC && !process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
  warnings.push("NEXT_PUBLIC_UMAMI_SRC is set but NEXT_PUBLIC_UMAMI_WEBSITE_ID is missing.");
}

if (process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && !process.env.NEXT_PUBLIC_UMAMI_SRC) {
  warnings.push("NEXT_PUBLIC_UMAMI_WEBSITE_ID is set but NEXT_PUBLIC_UMAMI_SRC is missing.");
}

console.log("Production environment validation");
console.log(`Mode: ${isProductionRuntime ? "production" : "local"}`);
console.log(`Required checks: ${required.length + 1 + (isProductionRuntime ? 1 : 0)}`);
console.log(`Failures: ${failures.length}`);
console.log(`Warnings: ${warnings.length}`);

for (const failure of failures) console.error(`ERROR: ${failure}`);
for (const warning of warnings) console.warn(`WARN: ${warning}`);

if (failures.length > 0) {
  process.exitCode = 1;
} else {
  console.log("Environment is ready for production checks.");
}

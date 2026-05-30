const { chromium } = require("playwright");

const baseUrl = process.argv[2] || process.env.SMOKE_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
const email = process.env.ADMIN_SMOKE_EMAIL;
const password = process.env.ADMIN_SMOKE_PASSWORD;

const adminRoutes = [
  "/admin",
  "/admin/posts",
  "/admin/posts/new",
  "/admin/kanban",
  "/admin/comments",
  "/admin/users",
  "/admin/ads",
  "/admin/rss",
  "/admin/podcasts",
  "/admin/social",
  "/admin/metrics",
  "/admin/metrics/market",
  "/admin/subscriptions",
  "/admin/audit",
  "/admin/health",
  "/admin/settings",
  "/admin/appearance",
  "/admin/sections",
  "/admin/alerts",
  "/admin/agenda",
  "/admin/denuncias",
  "/admin/profile",
];

function absolute(path) {
  return new URL(path, baseUrl).toString();
}

async function checkProtectedRoutes() {
  const results = [];
  for (const route of adminRoutes) {
    const response = await fetch(absolute(route), { redirect: "manual" });
    const location = response.headers.get("location") || "";
    const ok = [302, 307, 308].includes(response.status) && location.includes("/login");
    results.push({
      route,
      ok,
      status: response.status,
      detail: ok ? "redirects to login" : `expected redirect to login, got ${response.status} ${location}`,
    });
  }
  return results;
}

async function checkAuthenticatedRoutes() {
  if (!email || !password) {
    return [{
      route: "authenticated",
      ok: true,
      skipped: true,
      detail: "set ADMIN_SMOKE_EMAIL and ADMIN_SMOKE_PASSWORD to test authenticated admin pages",
    }];
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  try {
    await page.goto(absolute("/login"), { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /senha/i }).click();
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(password);
    await Promise.all([
      page.waitForURL(/\/admin/, { timeout: 15000 }),
      page.getByRole("button", { name: /entrar/i }).click(),
    ]);

    for (const route of adminRoutes) {
      const response = await page.goto(absolute(route), { waitUntil: "networkidle" });
      const bodyText = await page.locator("body").innerText({ timeout: 5000 });
      const currentUrl = page.url();
      const ok =
        Boolean(response?.ok()) &&
        !currentUrl.includes("/login") &&
        !bodyText.includes("Application error") &&
        !bodyText.includes("Internal Server Error");

      results.push({
        route,
        ok,
        status: response?.status() ?? 0,
        detail: ok ? "loaded" : `failed at ${currentUrl}`,
      });
    }
  } finally {
    await browser.close();
  }

  return results;
}

(async () => {
  const protectedResults = await checkProtectedRoutes();
  const authenticatedResults = await checkAuthenticatedRoutes();
  const allResults = [...protectedResults, ...authenticatedResults];

  for (const result of allResults) {
    const prefix = result.skipped ? "SKIP" : result.ok ? "PASS" : "FAIL";
    const status = result.status ? ` ${result.status}` : "";
    console.log(`${prefix} ${result.route}${status} - ${result.detail}`);
  }

  if (allResults.some((result) => !result.ok)) process.exitCode = 1;
})().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

const baseUrl = process.argv[2] || process.env.SMOKE_BASE_URL || process.env.NEXTAUTH_URL;

if (!baseUrl) {
  console.error("Usage: npm run smoke:prod -- https://example.com");
  process.exit(1);
}

const base = new URL(baseUrl);
const checks = [
  { path: "/", status: 200 },
  { path: "/login", status: 200 },
  { path: "/api/health", status: 200, bodyIncludes: '"status":"ok"' },
  { path: "/api/debug-vars", status: 404 },
  { path: "/admin", status: [302, 307, 308], locationIncludes: "/login" },
  { path: "/eu", status: [302, 307, 308], locationIncludes: "/login" },
  { path: "/api/cron/fetch-agri", status: 401 },
  { path: "/api/cron/rss-sync", status: 401 },
];

const requiredHeaders = [
  "content-security-policy",
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "permissions-policy",
  "strict-transport-security",
];

function statusMatches(actual, expected) {
  return Array.isArray(expected) ? expected.includes(actual) : actual === expected;
}

async function runCheck(check) {
  const url = new URL(check.path, base);
  const response = await fetch(url, { redirect: "manual" });
  const body = await response.text();
  const errors = [];

  if (!statusMatches(response.status, check.status)) {
    errors.push(`expected status ${JSON.stringify(check.status)}, got ${response.status}`);
  }

  if (check.bodyIncludes && !body.includes(check.bodyIncludes)) {
    errors.push(`body does not include ${check.bodyIncludes}`);
  }

  const location = response.headers.get("location") || "";
  if (check.locationIncludes && !location.includes(check.locationIncludes)) {
    errors.push(`location does not include ${check.locationIncludes}`);
  }

  if (check.path === "/" || check.path === "/login") {
    for (const header of requiredHeaders) {
      if (!response.headers.get(header)) errors.push(`missing header ${header}`);
    }
  }

  return {
    path: check.path,
    status: response.status,
    ok: errors.length === 0,
    errors,
  };
}

(async () => {
  const results = [];
  for (const check of checks) {
    results.push(await runCheck(check));
  }

  for (const result of results) {
    const prefix = result.ok ? "PASS" : "FAIL";
    console.log(`${prefix} ${result.path} ${result.status}`);
    for (const error of result.errors) console.log(`  - ${error}`);
  }

  if (results.some((result) => !result.ok)) process.exitCode = 1;
})();

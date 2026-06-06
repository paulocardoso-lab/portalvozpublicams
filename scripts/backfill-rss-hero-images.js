const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Pool } = require("pg");
const { parseHTML } = require("linkedom");
const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");

const RSS_SYSTEM_USER_ID = "rss-system-user-0000000000000001";
const MIN_IMAGE_WIDTH = 200;
const MIN_IMAGE_HEIGHT = 200;

function loadEnvFile(fileName, { override = false } = {}) {
  const envPath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (override || !process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local", { override: true });

function parseArgs(argv) {
  const args = {
    apply: false,
    limit: 25,
    offset: 0,
    all: false,
    json: false,
  };

  for (const arg of argv.slice(2)) {
    if (arg === "--apply") args.apply = true;
    else if (arg === "--dry-run") args.apply = false;
    else if (arg === "--all") args.all = true;
    else if (arg === "--json") args.json = true;
    else if (arg.startsWith("--limit=")) args.limit = Number.parseInt(arg.slice("--limit=".length), 10);
    else if (arg.startsWith("--offset=")) args.offset = Number.parseInt(arg.slice("--offset=".length), 10);
  }

  if (!Number.isFinite(args.limit) || args.limit < 1 || args.limit > 100) args.limit = 25;
  if (!Number.isFinite(args.offset) || args.offset < 0) args.offset = 0;
  return args;
}

function hostnameFor(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function normalizeUrl(value, baseUrl) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return null;

  try {
    return new URL(trimmed, baseUrl).toString();
  } catch {
    return null;
  }
}

function parseDimension(value) {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function imageUrlFromSrcset(value) {
  const srcset = value?.trim();
  if (!srcset) return null;

  return srcset
    .split(",")
    .map((part) => {
      const [url, descriptor] = part.trim().split(/\s+/, 2);
      const width = descriptor?.endsWith("w") ? Number.parseInt(descriptor, 10) : 0;
      return { url, width: Number.isFinite(width) ? width : 0 };
    })
    .filter((candidate) => candidate.url)
    .sort((a, b) => b.width - a.width)[0]?.url || null;
}

function isGoogleNewsAsset(url) {
  const host = hostnameFor(url);
  const lower = url.toLowerCase();
  return (
    host === "news.google.com" ||
    host.endsWith(".news.google.com") ||
    host === "gstatic.com" ||
    host.endsWith(".gstatic.com") ||
    host === "googleusercontent.com" ||
    host.endsWith(".googleusercontent.com") ||
    lower.includes("google-news") ||
    lower.includes("googlenews") ||
    lower.includes("news.google")
  );
}

function isGoogleNewsUrl(url) {
  const host = hostnameFor(url || "");
  return host === "news.google.com" || host.endsWith(".news.google.com");
}

function isLikelyLogoOrPlaceholder(url) {
  const lower = decodeURIComponent(url).toLowerCase();
  return [
    "favicon",
    "/logo",
    "logo.",
    "logomarca",
    "brand",
    "placeholder",
    "default-image",
    "default.jpg",
    "default.png",
    "sprite",
    "/icon",
    "apple-touch-icon",
  ].some((fragment) => lower.includes(fragment));
}

function isSuspiciousHeroImage(url) {
  if (!url) return true;
  return isGoogleNewsAsset(url) || isLikelyLogoOrPlaceholder(url);
}

function validateCandidate(candidate) {
  if (!/^https?:\/\//i.test(candidate.url)) return "not-http";
  if (isGoogleNewsAsset(candidate.url)) return "google-news-asset";
  if (isLikelyLogoOrPlaceholder(candidate.url)) return "logo-or-placeholder";
  if (
    candidate.width &&
    candidate.height &&
    (candidate.width < MIN_IMAGE_WIDTH || candidate.height < MIN_IMAGE_HEIGHT)
  ) {
    return "too-small";
  }
  return null;
}

function metaCandidate(document, selector, source, baseUrl) {
  const content = document.querySelector(selector)?.content;
  const url = normalizeUrl(content, baseUrl);
  return url ? [{ url, source }] : [];
}

function collectJsonLdImages(value, baseUrl, output) {
  if (!value) return;
  if (typeof value === "string") {
    const url = normalizeUrl(value, baseUrl);
    if (url) output.push({ url, source: "json-ld" });
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectJsonLdImages(item, baseUrl, output);
    return;
  }
  if (typeof value !== "object") return;

  const image = value.image ?? value.thumbnailUrl;
  if (image) collectJsonLdImages(image, baseUrl, output);

  const urlValue = value.url ?? value.contentUrl;
  if (typeof urlValue === "string") {
    const url = normalizeUrl(urlValue, baseUrl);
    if (url) output.push({ url, source: "json-ld" });
  }
}

function jsonLdCandidates(document, baseUrl) {
  const output = [];
  for (const script of Array.from(document.querySelectorAll('script[type="application/ld+json"]'))) {
    const text = script.textContent?.trim();
    if (!text) continue;
    try {
      collectJsonLdImages(JSON.parse(text), baseUrl, output);
    } catch {
      // Ignore malformed publisher metadata.
    }
  }
  return output;
}

function articleImageCandidates(document, baseUrl) {
  return Array.from(document.querySelectorAll("article img, main img, figure img, img"))
    .map((img) => {
      const src =
        img.getAttribute("src") ||
        img.getAttribute("data-src") ||
        img.getAttribute("data-original") ||
        img.getAttribute("data-lazy-src") ||
        imageUrlFromSrcset(img.getAttribute("srcset") || img.getAttribute("data-srcset"));
      const url = normalizeUrl(src, baseUrl);
      if (!url) return null;
      return {
        url,
        source: "article-img",
        width: parseDimension(img.getAttribute("width")),
        height: parseDimension(img.getAttribute("height")),
      };
    })
    .filter(Boolean);
}

function selectImageFromHtml(html, sourceUrl) {
  const { document } = parseHTML(html);
  const candidates = [
    ...metaCandidate(document, 'meta[property="og:image:secure_url"]', "og:image", sourceUrl),
    ...metaCandidate(document, 'meta[property="og:image:url"]', "og:image", sourceUrl),
    ...metaCandidate(document, 'meta[property="og:image"]', "og:image", sourceUrl),
    ...metaCandidate(document, 'meta[name="twitter:image"]', "twitter:image", sourceUrl),
    ...metaCandidate(document, 'meta[name="twitter:image:src"]', "twitter:image", sourceUrl),
    ...jsonLdCandidates(document, sourceUrl),
    ...articleImageCandidates(document, sourceUrl),
  ];

  const rejected = [];
  const seen = new Set();
  for (const candidate of candidates) {
    if (seen.has(candidate.url)) continue;
    seen.add(candidate.url);
    const reason = validateCandidate(candidate);
    if (reason) {
      rejected.push({ ...candidate, reason });
      continue;
    }
    return { selected: candidate, rejected };
  }

  return { selected: null, rejected };
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

async function downloadAndUploadImage(url) {
  const supabase = getSupabaseClient();
  if (!supabase) return { publicUrl: url, uploaded: false };

  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`image HTTP ${response.status}`);

  const inputBuffer = Buffer.from(await response.arrayBuffer());
  const metadata = await sharp(inputBuffer).metadata();
  if ((metadata.width ?? 0) < MIN_IMAGE_WIDTH || (metadata.height ?? 0) < MIN_IMAGE_HEIGHT) {
    throw new Error(`image too small: ${metadata.width ?? 0}x${metadata.height ?? 0}`);
  }

  const webpBuffer = await sharp(inputBuffer).webp({ quality: 85 }).toBuffer();
  const fileName = `rss-backfill-${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage
    .from("articles")
    .upload(fileName, webpBuffer, { contentType: "image/webp", upsert: true });
  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage.from("articles").getPublicUrl(fileName);
  return { publicUrl, uploaded: true };
}

async function fetchCandidates(client, args) {
  const suspiciousSql = `
    (
      a."heroImage" is null
      or lower(a."heroImage") like '%news.google%'
      or lower(a."heroImage") like '%google-news%'
      or lower(a."heroImage") like '%googlenews%'
      or lower(a."heroImage") like '%gstatic%'
      or lower(a."heroImage") like '%favicon%'
      or lower(a."heroImage") like '%/logo%'
      or lower(a."heroImage") like '%logo.%'
      or lower(a."heroImage") like '%placeholder%'
      or lower(a."heroImage") like '%default-image%'
      or lower(a."heroImage") like '%apple-touch-icon%'
      or lower(a."sourceUrl") like '%news.google.com%'
    )
  `;

  const whereImage = args.all ? "" : `and ${suspiciousSql}`;
  const { rows } = await client.query(
    `
      select a.id, a.title, a."sourceUrl", a."heroImage", a.status, a."createdAt"
      from "Article" a
      inner join "_Authors" au on au."A" = a.id and au."B" = $1
      where a."sourceUrl" is not null
        ${whereImage}
      order by a."createdAt" desc
      limit $2 offset $3
    `,
    [RSS_SYSTEM_USER_ID, args.limit, args.offset]
  );
  return rows;
}

async function processArticle(client, article, args) {
  const result = {
    id: article.id,
    title: article.title,
    sourceUrl: article.sourceUrl,
    currentHeroImage: article.heroImage,
    currentSuspicious: isSuspiciousHeroImage(article.heroImage) || isGoogleNewsUrl(article.sourceUrl),
    selectedImage: null,
    selectedSource: null,
    uploadedImage: null,
    rejectedImages: 0,
    changed: false,
    skipped: false,
    error: null,
  };

  try {
    const response = await fetch(article.sourceUrl, {
      signal: AbortSignal.timeout(20000),
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
      },
    });
    if (!response.ok) throw new Error(`source HTTP ${response.status}`);

    const html = await response.text();
    const { selected, rejected } = selectImageFromHtml(html, article.sourceUrl);
    result.rejectedImages = rejected.length;
    if (!selected) {
      result.skipped = true;
      return result;
    }

    result.selectedImage = selected.url;
    result.selectedSource = selected.source;

    if (!args.apply) return result;

    const uploaded = await downloadAndUploadImage(selected.url);
    result.uploadedImage = uploaded.publicUrl;

    await client.query("begin");
    const update = await client.query(
      `
        update "Article" a
        set "heroImage" = $1
        where a.id = $2
          and exists (
            select 1 from "_Authors" au
            where au."A" = a.id and au."B" = $3
          )
        returning a.id
      `,
      [uploaded.publicUrl, article.id, RSS_SYSTEM_USER_ID]
    );

    if (update.rowCount !== 1) throw new Error("safe update matched no article");
    await client.query("commit");
    result.changed = true;
    return result;
  } catch (error) {
    try {
      await client.query("rollback");
    } catch {
      // no open transaction
    }
    result.error = error instanceof Error ? error.message : String(error);
    return result;
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL ausente.");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
  const client = await pool.connect();
  const startedAt = Date.now();

  try {
    const candidates = await fetchCandidates(client, args);
    const results = [];

    for (const article of candidates) {
      results.push(await processArticle(client, article, args));
    }

    const summary = {
      mode: args.apply ? "apply" : "dry-run",
      scanned: candidates.length,
      candidatesWithImage: results.filter((item) => item.selectedImage).length,
      changed: results.filter((item) => item.changed).length,
      skipped: results.filter((item) => item.skipped).length,
      failed: results.filter((item) => item.error).length,
      durationMs: Date.now() - startedAt,
    };

    if (args.json) {
      console.log(JSON.stringify({ summary, results }, null, 2));
      return;
    }

    console.log(`RSS hero image backfill (${summary.mode})`);
    console.log(`Scanned: ${summary.scanned} | Found: ${summary.candidatesWithImage} | Changed: ${summary.changed} | Skipped: ${summary.skipped} | Failed: ${summary.failed}`);
    for (const item of results) {
      const marker = item.error ? "FAIL" : item.changed ? "APPLY" : item.selectedImage ? "PLAN" : "SKIP";
      console.log(`${marker} ${item.id} ${item.title}`);
      console.log(`  source: ${item.sourceUrl}`);
      console.log(`  current: ${item.currentHeroImage || "(none)"}`);
      if (item.selectedImage) console.log(`  candidate: ${item.selectedImage} (${item.selectedSource})`);
      if (item.uploadedImage) console.log(`  uploaded: ${item.uploadedImage}`);
      if (item.error) console.log(`  error: ${item.error}`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

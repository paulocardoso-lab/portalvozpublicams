const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "EDITOR_CHIEF",
  "SECTION_EDITOR",
  "REPORTER",
  "COLUMNIST",
  "MODERATOR",
  "FINANCE",
];

function loadEnvFile(fileName) {
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
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const args = new Set(process.argv.slice(2));
const execute = args.has("--execute");
const includeUsers = args.has("--include-users");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const countJobs = [
  ["articles", () => prisma.article.count()],
  ["articleVersions", () => prisma.articleVersion.count()],
  ["comments", () => prisma.comment.count()],
  ["savedArticles", () => prisma.savedArticle.count()],
  ["siteMetrics", () => prisma.siteMetric.count()],
  ["rssLogs", () => prisma.rSSLog.count()],
  ["rssFeeds", () => prisma.rSSFeed.count()],
  ["tips", () => prisma.tip.count()],
  ["campaigns", () => prisma.campaign.count()],
  ["podcastEpisodes", () => prisma.podcastEpisode.count()],
  ["newsletterSubscribers", () => prisma.newsletterSubscriber.count()],
  ["newsletters", () => prisma.newsletter.count()],
  ["transactions", () => prisma.transaction.count()],
  ["subscriptions", () => prisma.subscription.count()],
  ["auditLogs", () => prisma.auditLog.count()],
  ["nonAdminUsers", () => prisma.user.count({ where: { role: { notIn: ADMIN_ROLES } } })],
];

function isMissingTable(error) {
  return error && (error.code === "P2021" || error.code === "P2022");
}

async function safeCount(name, count) {
  try {
    return await count();
  } catch (error) {
    if (isMissingTable(error)) return `missing table: ${name}`;
    throw error;
  }
}

async function safeDelete(name, action) {
  try {
    await action();
  } catch (error) {
    if (isMissingTable(error)) {
      console.warn(`Skipping ${name}: table is missing in this database.`);
      return;
    }
    throw error;
  }
}

async function safeFindMany(name, action) {
  try {
    return await action();
  } catch (error) {
    if (isMissingTable(error)) return { skipped: `missing table: ${name}` };
    throw error;
  }
}

async function writeBackup() {
  const backup = {
    createdAt: new Date().toISOString(),
    tables: {
      articles: await safeFindMany("articles", () => prisma.article.findMany()),
      articleVersions: await safeFindMany("articleVersions", () => prisma.articleVersion.findMany()),
      comments: await safeFindMany("comments", () => prisma.comment.findMany()),
      savedArticles: await safeFindMany("savedArticles", () => prisma.savedArticle.findMany()),
      siteMetrics: await safeFindMany("siteMetrics", () => prisma.siteMetric.findMany()),
      rssLogs: await safeFindMany("rssLogs", () => prisma.rSSLog.findMany()),
      rssFeeds: await safeFindMany("rssFeeds", () => prisma.rSSFeed.findMany()),
      tips: await safeFindMany("tips", () => prisma.tip.findMany()),
      campaigns: await safeFindMany("campaigns", () => prisma.campaign.findMany()),
      podcastEpisodes: await safeFindMany("podcastEpisodes", () => prisma.podcastEpisode.findMany()),
      newsletterSubscribers: await safeFindMany("newsletterSubscribers", () => prisma.newsletterSubscriber.findMany()),
      newsletters: await safeFindMany("newsletters", () => prisma.newsletter.findMany()),
      transactions: await safeFindMany("transactions", () => prisma.transaction.findMany()),
      subscriptions: await safeFindMany("subscriptions", () => prisma.subscription.findMany()),
      auditLogs: await safeFindMany("auditLogs", () => prisma.auditLog.findMany()),
      nonAdminUsers: await safeFindMany("nonAdminUsers", () =>
        prisma.user.findMany({ where: { role: { notIn: ADMIN_ROLES } } })
      ),
    },
  };

  const backupDir = path.join(process.cwd(), "scratch", "backups");
  fs.mkdirSync(backupDir, { recursive: true });

  const stamp = backup.createdAt.replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `platform-cleanup-${stamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  return backupPath;
}

async function getCounts() {
  const entries = [];
  for (const [name, count] of countJobs) {
    entries.push([name, await safeCount(name, count)]);
  }
  return Object.fromEntries(entries);
}

async function cleanup() {
  await safeDelete("rssLogs", () => prisma.rSSLog.deleteMany());
  await safeDelete("articleVersions", () => prisma.articleVersion.deleteMany());
  await safeDelete("savedArticles", () => prisma.savedArticle.deleteMany());
  await safeDelete("comments", () => prisma.comment.deleteMany());
  await safeDelete("articles", () => prisma.article.deleteMany());
  await safeDelete("siteMetrics", () => prisma.siteMetric.deleteMany());
  await safeDelete("tips", () => prisma.tip.deleteMany());
  await safeDelete("campaigns", () => prisma.campaign.deleteMany());
  await safeDelete("podcastEpisodes", () => prisma.podcastEpisode.deleteMany());
  await safeDelete("newsletterSubscribers", () => prisma.newsletterSubscriber.deleteMany());
  await safeDelete("newsletters", () => prisma.newsletter.deleteMany());
  await safeDelete("transactions", () => prisma.transaction.deleteMany());
  await safeDelete("subscriptions", () => prisma.subscription.deleteMany());
  await safeDelete("auditLogs", () => prisma.auditLog.deleteMany());
  await safeDelete("rssFeeds", () => prisma.rSSFeed.deleteMany());

  if (includeUsers) {
    const users = await prisma.user.findMany({
      where: { role: { notIn: ADMIN_ROLES } },
      select: { id: true },
    });
    const userIds = users.map((user) => user.id);

    if (userIds.length > 0) {
      await prisma.account.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.session.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
  }
}

async function main() {
  const before = await getCounts();
  console.table(before);

  if (!execute) {
    console.log("Dry run only. Re-run with --execute to delete these records.");
    console.log("Add --include-users to also delete non-admin users.");
    return;
  }

  const backupPath = await writeBackup();
  console.log(`Backup written to ${backupPath}`);

  await cleanup();
  const after = await getCounts();
  console.table(after);
  console.log("Cleanup complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

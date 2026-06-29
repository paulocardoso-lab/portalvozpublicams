import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '@/app/api/cron/cleanup-analytics/route';
import prisma from '@/lib/prisma';

const prismaMock = prisma as unknown as {
  siteVisitorDaily: { deleteMany: ReturnType<typeof vi.fn> };
};

function makeRequest(authHeader?: string) {
  return new Request('http://localhost/api/cron/cleanup-analytics', {
    headers: authHeader ? { authorization: authHeader } : {},
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  prismaMock.siteVisitorDaily.deleteMany.mockResolvedValue({ count: 42 });

  // Force non-production for most tests so auth is bypassed
  vi.stubEnv('NODE_ENV', 'test');
  vi.stubEnv('CRON_SECRET', 'test-secret');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('GET /api/cron/cleanup-analytics', () => {
  it('returns 200 with deletion summary in non-production', async () => {
    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.deletedVisitors).toBe(42);
    expect(body.retentionDays).toBe(180);
    expect(body.cutoff).toBeDefined();
  });

  it('calls deleteMany with a cutoff date in the past', async () => {
    await GET(makeRequest());
    const call = prismaMock.siteVisitorDaily.deleteMany.mock.calls[0][0];
    expect(call.where.date.lt).toBeInstanceOf(Date);
    expect(call.where.date.lt < new Date()).toBe(true);
  });

  it('returns 401 in production without token', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it('returns 401 in production with wrong token', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const res = await GET(makeRequest('Bearer wrong-token'));
    expect(res.status).toBe(401);
  });

  it('returns 200 in production with correct token', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const res = await GET(makeRequest('Bearer test-secret'));
    expect(res.status).toBe(200);
  });

  it('respects ANALYTICS_VISITOR_RETENTION_DAYS env var', async () => {
    vi.stubEnv('ANALYTICS_VISITOR_RETENTION_DAYS', '90');
    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.retentionDays).toBe(90);
  });

  it('cutoff is start-of-day 30 days ago', async () => {
    vi.stubEnv('ANALYTICS_VISITOR_RETENTION_DAYS', '30');
    const res = await GET(makeRequest());
    const body = await res.json();
    const cutoff = new Date(body.cutoff);

    const expected = new Date();
    expected.setDate(expected.getDate() - 30);
    expected.setHours(0, 0, 0, 0);

    expect(cutoff.getTime()).toBe(expected.getTime());
  });

  it('returns 500 when prisma throws', async () => {
    prismaMock.siteVisitorDaily.deleteMany.mockRejectedValue(new Error('db error'));
    const res = await GET(makeRequest());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });
});

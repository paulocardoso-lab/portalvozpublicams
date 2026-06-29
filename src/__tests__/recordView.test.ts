import { describe, it, expect, vi, beforeEach } from 'vitest';
import { recordView } from '@/app/actions/analytics';
import prisma from '@/lib/prisma';
import { rateLimitAction } from '@/lib/rate-limit';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const prismaMock = prisma as unknown as {
  siteVisitorDaily: { create: ReturnType<typeof vi.fn> };
  article: { update: ReturnType<typeof vi.fn> };
  articleViewDaily: { upsert: ReturnType<typeof vi.fn> };
  articleViewEvent: { create: ReturnType<typeof vi.fn> };
  siteMetric: { upsert: ReturnType<typeof vi.fn> };
};

const rateLimitMock = rateLimitAction as ReturnType<typeof vi.fn>;
const cookiesMock = cookies as ReturnType<typeof vi.fn>;

const ARTICLE_ID = 'article-abc-123';
const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const VISITOR_HASH = crypto.createHash('sha256').update(VALID_UUID).digest('hex');

function mockCookieStore(existingVisitorId?: string) {
  const cookieStore = {
    get: vi.fn().mockReturnValue(existingVisitorId ? { value: existingVisitorId } : undefined),
    set: vi.fn(),
  };
  cookiesMock.mockResolvedValue(cookieStore);
  return cookieStore;
}

beforeEach(() => {
  vi.clearAllMocks();

  prismaMock.siteVisitorDaily.create.mockResolvedValue({ id: 1 });
  prismaMock.article.update.mockResolvedValue({});
  prismaMock.articleViewDaily.upsert.mockResolvedValue({});
  prismaMock.articleViewEvent.create.mockResolvedValue({});
  prismaMock.siteMetric.upsert.mockResolvedValue({});

  rateLimitMock.mockResolvedValue({ limited: false });
});

describe('recordView', () => {
  it('returns success: true on happy path', async () => {
    mockCookieStore(VALID_UUID);
    const result = await recordView(ARTICLE_ID);
    expect(result).toEqual({ success: true });
  });

  it('increments article views', async () => {
    mockCookieStore(VALID_UUID);
    await recordView(ARTICLE_ID);

    expect(prismaMock.article.update).toHaveBeenCalledWith({
      where: { id: ARTICLE_ID },
      data: { views: { increment: 1 } },
    });
  });

  it('upserts ArticleViewDaily for today', async () => {
    mockCookieStore(VALID_UUID);
    const before = new Date();
    await recordView(ARTICLE_ID);
    const after = new Date();

    const call = prismaMock.articleViewDaily.upsert.mock.calls[0][0];
    expect(call.where.articleId_date.articleId).toBe(ARTICLE_ID);

    const date: Date = call.where.articleId_date.date;
    expect(date.getHours()).toBe(0);
    expect(date >= new Date(before.getFullYear(), before.getMonth(), before.getDate())).toBe(true);
    expect(date <= new Date(after.getFullYear(), after.getMonth(), after.getDate())).toBe(true);
  });

  it('creates SiteVisitorDaily with correct hash', async () => {
    mockCookieStore(VALID_UUID);
    await recordView(ARTICLE_ID);

    expect(prismaMock.siteVisitorDaily.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ visitorHash: VISITOR_HASH }),
      })
    );
  });

  it('increments SiteMetric visitors when visitor is new', async () => {
    mockCookieStore(VALID_UUID);
    prismaMock.siteVisitorDaily.create.mockResolvedValue({ id: 1 });
    await recordView(ARTICLE_ID);

    const call = prismaMock.siteMetric.upsert.mock.calls[0][0];
    expect(call.update.visitors).toEqual({ increment: 1 });
  });

  it('does not increment visitors when visitor already existed today (P2002)', async () => {
    mockCookieStore(VALID_UUID);
    prismaMock.siteVisitorDaily.create.mockRejectedValue({ code: 'P2002' });
    await recordView(ARTICLE_ID);

    const call = prismaMock.siteMetric.upsert.mock.calls[0][0];
    expect(call.update.visitors).toBeUndefined();
  });

  it('generates a new cookie when none exists', async () => {
    const store = mockCookieStore(undefined);
    await recordView(ARTICLE_ID);
    expect(store.set).toHaveBeenCalledWith(
      'vp_visitor_id',
      expect.any(String),
      expect.objectContaining({ httpOnly: true })
    );
  });

  it('returns success: false when rate limited', async () => {
    mockCookieStore(VALID_UUID);
    rateLimitMock.mockResolvedValue({ limited: true });
    const result = await recordView(ARTICLE_ID);
    expect(result).toEqual({ success: false });
    expect(prismaMock.article.update).not.toHaveBeenCalled();
  });

  it('returns success: false when prisma throws unexpected error', async () => {
    mockCookieStore(VALID_UUID);
    prismaMock.siteVisitorDaily.create.mockRejectedValue(new Error('connection refused'));
    const result = await recordView(ARTICLE_ID);
    expect(result).toEqual({ success: false });
  });
});

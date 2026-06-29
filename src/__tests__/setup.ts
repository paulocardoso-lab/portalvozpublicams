import { vi } from 'vitest';

const mockHeaderStore = {
  get: vi.fn().mockReturnValue(null),
};

// Mock Next.js server APIs used by analytics actions
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
  headers: vi.fn().mockResolvedValue(mockHeaderStore),
}));

export { mockHeaderStore };

// Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  default: {
    siteVisitorDaily: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    article: {
      update: vi.fn(),
    },
    articleViewDaily: {
      upsert: vi.fn(),
      groupBy: vi.fn(),
    },
    articleViewEvent: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    siteMetric: {
      upsert: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

// Mock rate limiter — default: not limited
vi.mock('@/lib/rate-limit', () => ({
  rateLimitAction: vi.fn().mockResolvedValue({ limited: false }),
  rateLimitRequest: vi.fn().mockReturnValue({ limited: false }),
}));

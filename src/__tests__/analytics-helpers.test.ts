import { describe, it, expect, afterEach } from 'vitest';
import { startOfDay, isValidVisitorId, retentionDays } from '@/lib/analytics-helpers';

describe('startOfDay', () => {
  it('zeroes out hours, minutes, seconds and milliseconds', () => {
    const d = new Date(2026, 5, 15, 13, 45, 59, 999);
    const result = startOfDay(d);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('preserves year, month and day', () => {
    const d = new Date(2026, 5, 15, 23, 59);
    const result = startOfDay(d);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(15);
  });

  it('returns a new Date object', () => {
    const d = new Date();
    expect(startOfDay(d)).not.toBe(d);
  });
});

describe('isValidVisitorId', () => {
  it('accepts a valid UUID v4', () => {
    expect(isValidVisitorId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('accepts 64-char hex string', () => {
    expect(isValidVisitorId('a'.repeat(64))).toBe(true);
  });

  it('accepts 32-char hex string', () => {
    expect(isValidVisitorId('f'.repeat(32))).toBe(true);
  });

  it('rejects undefined', () => {
    expect(isValidVisitorId(undefined)).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidVisitorId('')).toBe(false);
  });

  it('rejects string shorter than 32 chars', () => {
    expect(isValidVisitorId('abc123')).toBe(false);
  });

  it('rejects string with invalid characters', () => {
    expect(isValidVisitorId('g'.repeat(32))).toBe(false);
  });

  it('rejects string longer than 64 chars', () => {
    expect(isValidVisitorId('a'.repeat(65))).toBe(false);
  });
});

describe('retentionDays', () => {
  const originalEnv = process.env.ANALYTICS_VISITOR_RETENTION_DAYS;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.ANALYTICS_VISITOR_RETENTION_DAYS;
    } else {
      process.env.ANALYTICS_VISITOR_RETENTION_DAYS = originalEnv;
    }
  });

  it('returns 180 when env var is not set', () => {
    delete process.env.ANALYTICS_VISITOR_RETENTION_DAYS;
    expect(retentionDays()).toBe(180);
  });

  it('returns configured value within bounds', () => {
    process.env.ANALYTICS_VISITOR_RETENTION_DAYS = '365';
    expect(retentionDays()).toBe(365);
  });

  it('clamps to minimum 30 days', () => {
    process.env.ANALYTICS_VISITOR_RETENTION_DAYS = '5';
    expect(retentionDays()).toBe(30);
  });

  it('clamps to maximum 730 days', () => {
    process.env.ANALYTICS_VISITOR_RETENTION_DAYS = '9999';
    expect(retentionDays()).toBe(730);
  });

  it('floors fractional values', () => {
    process.env.ANALYTICS_VISITOR_RETENTION_DAYS = '90.9';
    expect(retentionDays()).toBe(90);
  });

  it('returns 180 for non-numeric string', () => {
    process.env.ANALYTICS_VISITOR_RETENTION_DAYS = 'abc';
    expect(retentionDays()).toBe(180);
  });
});

import { describe, expect, it } from 'vitest';
import { formatBytes, getUtf8SizeBytes } from './payload';

describe('payload utilities', () => {
  it('calculates UTF-8 size for payload limits', () => {
    expect(getUtf8SizeBytes('abc')).toBe(3);
    expect(getUtf8SizeBytes('ą')).toBeGreaterThan(1);
  });

  it('formats bytes for operator messages', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
  });
});

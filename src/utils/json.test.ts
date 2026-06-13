import { describe, expect, it } from 'vitest';
import { formatJson, parseJsonInput } from './json';

describe('json utilities', () => {
  it('parses valid JSON payload', () => {
    const result = parseJsonInput('{"amount":"100.00"}');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ amount: '100.00' });
    }
  });

  it('returns stable error for invalid JSON payload', () => {
    const result = parseJsonInput('{broken');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message.length).toBeGreaterThan(0);
    }
  });

  it('formats JSON strings and objects', () => {
    expect(formatJson('{"ok":true}')).toContain('"ok": true');
    expect(formatJson({ ok: true })).toContain('"ok": true');
  });

  it('falls back to raw string when JSON formatting fails', () => {
    expect(formatJson('{broken')).toBe('{broken');
  });
});

import { describe, expect, it } from 'vitest';
import { formatDateTime } from './date';

describe('date utilities', () => {
  it('renders null values as dash', () => {
    expect(formatDateTime(null)).toBe('—');
  });

  it('keeps invalid dates readable', () => {
    expect(formatDateTime('not-a-date')).toBe('not-a-date');
  });
});

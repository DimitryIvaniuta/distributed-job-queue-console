import { describe, expect, it } from 'vitest';
import { getStatusTone, toStatusRows } from './job';

describe('job utilities', () => {
  it('maps status to tone', () => {
    expect(getStatusTone('DLQ')).toBe('danger');
    expect(getStatusTone('SUCCEEDED')).toBe('success');
  });

  it('sorts known operational statuses before unknown statuses', () => {
    expect(toStatusRows({ SUCCEEDED: 2, CUSTOM: 9, DLQ: 1 })).toEqual([
      ['DLQ', 1],
      ['SUCCEEDED', 2],
      ['CUSTOM', 9],
    ]);
  });
});

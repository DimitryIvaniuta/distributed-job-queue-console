import { z } from 'zod';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getApiBaseUrl, requestJson } from './http';

describe('http client', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('normalizes the configured API base URL', () => {
    expect(getApiBaseUrl()).toBe('http://localhost:8080');
  });

  it('validates backend response contracts', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ id: 123 }), { status: 200 }));

    await expect(requestJson('/contract', z.object({ id: z.string() }))).rejects.toMatchObject({ code: 'INVALID_BACKEND_CONTRACT' });
  });

  it('maps backend error bodies to ApiError', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ code: 'JOB_NOT_FOUND', message: 'Job was not found.', timestamp: '2026-06-06T08:00:00Z' }), { status: 404 }),
    );

    const promise = requestJson('/missing', z.object({ id: z.string() }));

    await expect(promise).rejects.toMatchObject({ code: 'JOB_NOT_FOUND', status: 404 });
  });
});

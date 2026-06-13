import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createTestQueryClient } from '../test/render';
import { jobFixture, statsFixture } from '../test/fixtures';
import { jobsApi } from './jobsApi';
import {
  jobQueryKeys,
  useBackendHealthQuery,
  useCreateJobMutation,
  useJobStatsQuery,
  useLookupJobByIdMutation,
  useLookupJobByKeyMutation,
  useReplayJobMutation,
} from './jobQueries';

vi.mock('./jobsApi', () => ({
  jobsApi: {
    createJob: vi.fn(),
    getById: vi.fn(),
    getByIdempotencyKey: vi.fn(),
    health: vi.fn(),
    replay: vi.fn(),
    stats: vi.fn(),
  },
}));

function wrapper({ children }: PropsWithChildren): React.JSX.Element {
  return <QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>;
}

describe('job query hooks', () => {
  it('loads job stats', async () => {
    vi.mocked(jobsApi.stats).mockResolvedValue(statsFixture);

    const { result } = renderHook(() => useJobStatsQuery(), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(statsFixture));
  });

  it('loads backend health', async () => {
    vi.mocked(jobsApi.health).mockResolvedValue({ status: 'UP' });

    const { result } = renderHook(() => useBackendHealthQuery(), { wrapper });

    await waitFor(() => expect(result.current.data?.status).toBe('UP'));
  });

  it('creates a job and caches it by id and idempotency key', async () => {
    vi.mocked(jobsApi.createJob).mockResolvedValue(jobFixture);
    const queryClient = createTestQueryClient();
    const localWrapper = ({ children }: PropsWithChildren): React.JSX.Element => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    const { result } = renderHook(() => useCreateJobMutation(), { wrapper: localWrapper });

    await result.current.mutateAsync({ idempotencyKey: jobFixture.idempotencyKey, type: jobFixture.type, priority: jobFixture.priority, payload: {}, maxAttempts: 4 });

    expect(queryClient.getQueryData(jobQueryKeys.byId(jobFixture.id))).toEqual(jobFixture);
    expect(queryClient.getQueryData(jobQueryKeys.byKey(jobFixture.idempotencyKey))).toEqual(jobFixture);
  });

  it('looks up a job by id', async () => {
    vi.mocked(jobsApi.getById).mockResolvedValue(jobFixture);

    const { result } = renderHook(() => useLookupJobByIdMutation(), { wrapper });

    await expect(result.current.mutateAsync(jobFixture.id)).resolves.toEqual(jobFixture);
  });

  it('looks up a job by idempotency key', async () => {
    vi.mocked(jobsApi.getByIdempotencyKey).mockResolvedValue(jobFixture);

    const { result } = renderHook(() => useLookupJobByKeyMutation(), { wrapper });

    await expect(result.current.mutateAsync(jobFixture.idempotencyKey)).resolves.toEqual(jobFixture);
  });

  it('replays a DLQ job', async () => {
    vi.mocked(jobsApi.replay).mockResolvedValue(jobFixture);

    const { result } = renderHook(() => useReplayJobMutation(), { wrapper });

    await expect(result.current.mutateAsync({ jobId: jobFixture.id, priority: 'HIGH' })).resolves.toEqual(jobFixture);
  });
});

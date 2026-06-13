import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { jobsApi } from './jobsApi';
import type { CreateJobRequest, JobPriority, JobResponse, ReplayJobRequest } from '../types/job';

/** Centralized cache keys keep server-state invalidation predictable. */
export const jobQueryKeys = {
  all: ['jobs'] as const,
  health: ['health'] as const,
  stats: ['jobs', 'stats'] as const,
  byId: (id: string) => ['jobs', 'by-id', id] as const,
  byKey: (idempotencyKey: string) => ['jobs', 'by-idempotency-key', idempotencyKey] as const,
};

/** Polls backend stats with modest cadence suitable for an operator console. */
export function useJobStatsQuery() {
  return useQuery({
    queryKey: jobQueryKeys.stats,
    queryFn: () => jobsApi.stats(),
    refetchInterval: 15_000,
    retry: 1,
    staleTime: 5_000,
  });
}

/** Polls actuator health without blocking core UI interactions. */
export function useBackendHealthQuery() {
  return useQuery({
    queryKey: jobQueryKeys.health,
    queryFn: () => jobsApi.health(),
    refetchInterval: 30_000,
    retry: false,
    staleTime: 10_000,
  });
}

/** Creates jobs and refreshes dashboard counters after successful command acceptance. */
export function useCreateJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateJobRequest) => jobsApi.createJob(request),
    onSuccess: (job) => {
      queryClient.setQueryData(jobQueryKeys.byId(job.id), job);
      queryClient.setQueryData(jobQueryKeys.byKey(job.idempotencyKey), job);
      void queryClient.invalidateQueries({ queryKey: jobQueryKeys.stats });
    },
  });
}

/** Runs a job lookup by UUID and stores the projection for future screens. */
export function useLookupJobByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobsApi.getById(jobId),
    onSuccess: (job) => cacheJob(queryClient, job),
  });
}

/** Runs a job lookup by idempotency key and stores the projection for future screens. */
export function useLookupJobByKeyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idempotencyKey: string) => jobsApi.getByIdempotencyKey(idempotencyKey),
    onSuccess: (job) => cacheJob(queryClient, job),
  });
}

/** Replays a DLQ job and refreshes dashboard/lookup caches. */
export function useReplayJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, priority }: { readonly jobId: string; readonly priority: JobPriority }) =>
      jobsApi.replay(jobId, { priority } satisfies ReplayJobRequest),
    onSuccess: (job) => {
      cacheJob(queryClient, job);
      void queryClient.invalidateQueries({ queryKey: jobQueryKeys.stats });
    },
  });
}

/** Stores one backend projection under all supported lookup keys. */
function cacheJob(queryClient: QueryClient, job: JobResponse): void {
  queryClient.setQueryData(jobQueryKeys.byId(job.id), job);
  queryClient.setQueryData(jobQueryKeys.byKey(job.idempotencyKey), job);
}

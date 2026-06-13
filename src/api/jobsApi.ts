import { requestJson } from './http';
import { healthResponseSchema, jobResponseSchema, jobStatsResponseSchema } from '../schemas/jobSchemas';
import type { CreateJobRequest, HealthResponse, JobResponse, JobStatsResponse, ReplayJobRequest } from '../types/job';

/** API client matching the Spring WebFlux /api/v1/jobs contract. */
export const jobsApi = {
  createJob(request: CreateJobRequest): Promise<JobResponse> {
    return requestJson('/api/v1/jobs', jobResponseSchema, { method: 'POST', body: JSON.stringify(request) });
  },

  getById(id: string): Promise<JobResponse> {
    return requestJson(`/api/v1/jobs/${encodeURIComponent(id)}`, jobResponseSchema);
  },

  getByIdempotencyKey(key: string): Promise<JobResponse> {
    return requestJson(`/api/v1/jobs/idempotency/${encodeURIComponent(key)}`, jobResponseSchema);
  },

  health(): Promise<HealthResponse> {
    return requestJson('/actuator/health', healthResponseSchema);
  },

  replay(id: string, request: ReplayJobRequest): Promise<JobResponse> {
    return requestJson(`/api/v1/jobs/${encodeURIComponent(id)}/replay`, jobResponseSchema, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  stats(): Promise<JobStatsResponse> {
    return requestJson('/api/v1/jobs/stats', jobStatsResponseSchema);
  },
};

import type { JobResponse, JobStatsResponse } from '../types/job';
/** Stable job fixture used by unit and e2e tests. */
export const jobFixture: JobResponse = { id:'11111111-1111-4111-8111-111111111111', idempotencyKey:'transfer-2026-0001', type:'BANK_TRANSFER_SETTLEMENT', priority:'HIGH', status:'QUEUED', attempt:0, maxAttempts:4, nextRetryAt:null, resultJson:null, errorMessage:null, traceId:'trace-2026-0001', createdAt:'2026-06-06T08:00:00Z', updatedAt:'2026-06-06T08:00:00Z', completedAt:null };
/** Stable stats fixture. */
export const statsFixture: JobStatsResponse = { countsByStatus: { ACCEPTED:1, QUEUED:4, PROCESSING:2, RETRY_SCHEDULED:3, SUCCEEDED:12, DLQ:1 } };

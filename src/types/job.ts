/** Priority lanes exposed by the backend Kafka queue. */
export type JobPriority = 'HIGH' | 'LOW';

/** Durable lifecycle state returned by the backend. */
export type JobStatus = 'ACCEPTED' | 'QUEUED' | 'PROCESSING' | 'RETRY_SCHEDULED' | 'SUCCEEDED' | 'DLQ';

/** Request body for POST /api/v1/jobs. */
export interface CreateJobRequest {
  readonly idempotencyKey: string;
  readonly type: string;
  readonly priority: JobPriority;
  readonly payload: unknown;
  readonly maxAttempts: number;
}

/** Request body for POST /api/v1/jobs/{id}/replay. */
export interface ReplayJobRequest {
  readonly priority: JobPriority;
}

/** Stable job response contract generated from the backend Java record. */
export interface JobResponse {
  readonly id: string;
  readonly idempotencyKey: string;
  readonly type: string;
  readonly priority: JobPriority;
  readonly status: JobStatus;
  readonly attempt: number;
  readonly maxAttempts: number;
  readonly nextRetryAt: string | null;
  readonly resultJson: string | null;
  readonly errorMessage: string | null;
  readonly traceId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly completedAt: string | null;
}

/** Backend status aggregation. Unknown future statuses remain displayable. */
export interface JobStatsResponse {
  readonly countsByStatus: Readonly<Record<string, number>>;
}

/** Stable backend error body. */
export interface ApiErrorResponse {
  readonly code: string;
  readonly message: string;
  readonly timestamp: string;
}

/** Minimal actuator health shape used by the header status pill. */
export interface HealthResponse {
  readonly status: string;
}

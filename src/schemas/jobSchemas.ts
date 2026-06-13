import { z } from 'zod';
import type { HealthResponse, JobResponse, JobStatsResponse } from '../types/job';

/** Runtime schema for backend priority values. */
export const jobPrioritySchema = z.enum(['HIGH', 'LOW']);

/** Runtime schema for backend durable job status values. */
export const jobStatusSchema = z.enum(['ACCEPTED', 'QUEUED', 'PROCESSING', 'RETRY_SCHEDULED', 'SUCCEEDED', 'DLQ']);

/** Runtime response validation for a single job projection. */
export const jobResponseSchema = z.object({
  id: z.string().min(1),
  idempotencyKey: z.string().min(1),
  type: z.string().min(1),
  priority: jobPrioritySchema,
  status: jobStatusSchema,
  attempt: z.number().int().nonnegative(),
  maxAttempts: z.number().int().positive(),
  nextRetryAt: z.string().nullable(),
  resultJson: z.string().nullable(),
  errorMessage: z.string().nullable(),
  traceId: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  completedAt: z.string().nullable(),
}) satisfies z.ZodType<JobResponse>;

/** Runtime response validation for status counters. */
export const jobStatsResponseSchema = z.object({
  countsByStatus: z.record(z.string(), z.number().int().nonnegative()),
}) satisfies z.ZodType<JobStatsResponse>;

/** Runtime response validation for Spring Boot actuator health. */
export const healthResponseSchema = z.object({
  status: z.string().min(1),
}) satisfies z.ZodType<HealthResponse>;

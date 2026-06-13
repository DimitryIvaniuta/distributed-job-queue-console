import type { ZodType } from 'zod';
import { ZodError } from 'zod';
import { getRuntimeConfig } from '../config/env';
import type { ApiErrorResponse } from '../types/job';

/** Application-level API exception with safe display fields. */
export class ApiError extends Error {
  public constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Returns the normalized backend origin used by all API calls. */
export function getApiBaseUrl(): string {
  return getRuntimeConfig().apiBaseUrl;
}

/** Creates an opaque request id for backend correlation and support tickets. */
function createRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `ui-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Maps parsing failures into a deterministic operator-facing error. */
function toContractError(error: unknown): ApiError {
  if (error instanceof ZodError) {
    const firstIssue = error.issues.at(0);
    const issuePath = firstIssue?.path.join('.') ?? 'response';
    const issueMessage = firstIssue?.message ?? 'Invalid backend response.';
    return new ApiError(0, 'INVALID_BACKEND_CONTRACT', `${issuePath}: ${issueMessage}`);
  }

  return new ApiError(0, 'INVALID_BACKEND_CONTRACT', 'Invalid backend response.');
}

/** Typed fetch wrapper with timeout, correlation headers and runtime response validation. */
export async function requestJson<TResponse>(
  path: string,
  schema: ZodType<TResponse>,
  options: RequestInit = {},
): Promise<TResponse> {
  const config = getRuntimeConfig();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), config.requestTimeoutMs);

  try {
    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    headers.set('X-Request-Id', createRequestId());
    headers.set('X-Client-Version', config.appVersion);

    if (options.body !== undefined && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${config.apiBaseUrl}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw await toApiError(response);
    }

    const body = (await response.json()) as unknown;
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof ZodError) {
      throw toContractError(error);
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(0, 'REQUEST_TIMEOUT', 'Backend request timed out.');
    }

    throw new ApiError(0, 'NETWORK_ERROR', 'Backend is unavailable or CORS is not configured.');
  } finally {
    window.clearTimeout(timeout);
  }
}

/** Converts backend error JSON into a stable UI exception. */
async function toApiError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as Partial<ApiErrorResponse>;
    return new ApiError(response.status, body.code ?? `HTTP_${response.status}`, body.message ?? response.statusText);
  } catch {
    return new ApiError(response.status, `HTTP_${response.status}`, response.statusText);
  }
}

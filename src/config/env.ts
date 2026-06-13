const DEFAULT_API_BASE_URL = 'http://localhost:8080';
const REQUEST_TIMEOUT_MS = 15_000;
const PAYLOAD_LIMIT_BYTES = 16_384;

declare global {
  interface Window {
    readonly __QUEUEOPS_CONFIG__?: Readonly<Partial<{ apiBaseUrl: string; appVersion: string }>>;
  }
}

/** Browser-safe application configuration derived from runtime config.js or Vite variables. */
export interface RuntimeConfig {
  readonly apiBaseUrl: string;
  readonly appVersion: string;
  readonly requestTimeoutMs: number;
  readonly payloadLimitBytes: number;
}

/** Ensures operators cannot accidentally point the app at unsafe protocols. */
function normalizeApiBaseUrl(rawValue: unknown): string {
  const value = (typeof rawValue === 'string' && rawValue.trim().length > 0 ? rawValue : DEFAULT_API_BASE_URL).trim();
  const url = new URL(value);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only http and https API URLs are allowed.');
  }

  return url.origin;
}

/** Returns immutable runtime config for API, validation and observability helpers. */
export function getRuntimeConfig(): RuntimeConfig {
  const runtimeConfig = typeof window === 'undefined' ? undefined : window.__QUEUEOPS_CONFIG__;
  const runtimeApiBaseUrl = runtimeConfig?.apiBaseUrl;
  const runtimeAppVersion = runtimeConfig?.appVersion;

  return {
    apiBaseUrl: normalizeApiBaseUrl(runtimeApiBaseUrl ?? import.meta.env['VITE_API_BASE_URL']),
    appVersion: typeof runtimeAppVersion === 'string' && runtimeAppVersion.trim().length > 0 ? runtimeAppVersion : String(import.meta.env['VITE_APP_VERSION'] ?? 'local'),
    requestTimeoutMs: REQUEST_TIMEOUT_MS,
    payloadLimitBytes: PAYLOAD_LIMIT_BYTES,
  };
}

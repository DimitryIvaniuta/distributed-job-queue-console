# Distributed Job Queue Console

**GitHub repository name:** `distributed-job-queue-console`  
**Description:** Production-grade React 19.2 / TypeScript / Vite 8 banking-style operations console for the Distributed Priority Job Queue backend.

## Stack

- React 19.2.7
- TypeScript 6.0.3 with strict compiler settings
- Vite 8.0.16
- TanStack Query 5 for server-state caching, polling and mutation invalidation
- Zod 4 for runtime backend contract validation
- React Router 7 for bookmarkable operator routes
- Vitest + Testing Library
- Playwright e2e tests
- ESLint 10 + typescript-eslint strict typed rules
- Nginx production image with security headers

## Backend contract

| Screen | Endpoint |
| --- | --- |
| Header health | `GET /actuator/health` |
| Dashboard | `GET /api/v1/jobs/stats` |
| Submit Job | `POST /api/v1/jobs` |
| Lookup by ID | `GET /api/v1/jobs/{id}` |
| Lookup by idempotency key | `GET /api/v1/jobs/idempotency/{key}` |
| Replay DLQ job | `POST /api/v1/jobs/{id}/replay` |

## Features

- Banking-style layout with header, footer, sidebar and central area
- Bookmarkable routes: dashboard, submit, lookup, replay, architecture
- Dashboard with durable job status counters and 15-second auto-refresh
- Backend health pill from Spring Boot Actuator
- Runtime environment banner showing backend origin and frontend version
- Create-job form: idempotency key, type, priority, payload JSON, max attempts
- Local JSON validation and 16 KB payload guardrail before submit
- Lookup by job ID or idempotency key
- DLQ replay form
- Typed API client with request timeout, request correlation headers and backend error mapping
- Zod validation for backend responses to catch contract drift early
- React-safe rendering without `dangerouslySetInnerHTML`
- Error boundary to prevent total UI blank screen on render defects
- Unit/component tests and essential Playwright e2e tests
- Dockerfile, Nginx hardening and GitHub Actions CI

## Run locally

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:5173`. The frontend calls `http://localhost:8080` by default.

## Validate

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run e2e
npm run audit
```

## Docker

```bash
docker build -t distributed-job-queue-console:local .
docker run --rm -p 3000:8080 -e VITE_API_BASE_URL=http://localhost:8080 distributed-job-queue-console:local
```

## Production notes

- Serve behind TLS/CDN or hardened Nginx.
- Configure backend CORS for the frontend origin.
- Add OIDC Authorization Code + PKCE before public exposure.
- Do not store tokens in localStorage.
- Keep `npm audit --audit-level=high` in CI.
- Keep Zod schemas aligned with backend Java records.

## Interview talking points

- UI mirrors backend correctness: idempotency key, priority lane, retries and DLQ replay.
- TanStack Query handles server-state caching, polling, retries and invalidation without hand-written sync code.
- Runtime validation catches backend/frontend contract drift before operators act on bad data.
- Duplicate side-effect protection remains backend-owned by uniqueness and receipts.
- E2E tests mock backend HTTP calls, so CI does not need Kafka/PostgreSQL.

# Frontend Architecture

```text
src/api        typed backend client, query keys, TanStack Query hooks
src/config     runtime configuration validation
src/schemas    Zod schemas for backend response contracts
src/types      DTO contracts from backend Java records
src/utils      pure JSON/date/status/payload helpers
src/components reusable UI primitives and error boundary
src/layout     banking application shell and navigation
src/pages      dashboard, create, lookup, replay, architecture
src/features   domain widgets such as JobDetails
src/test       provider-aware test helpers and fixtures
```

## Main production choices

1. **Server state:** TanStack Query owns dashboard polling, mutation invalidation and cache reuse.
2. **Contract safety:** Zod validates backend JSON at runtime, so backend contract drift fails loudly.
3. **Operator UX:** Routes are bookmarkable and safe to refresh. The dashboard auto-refreshes every 15 seconds.
4. **Security:** no `dangerouslySetInnerHTML`, no browser token storage, strict API protocol validation, CSP in Nginx.
5. **Resilience:** API timeout, request correlation headers and an error boundary prevent unclear blank-screen failures.

## Request flow

```text
Operator UI -> typed API client -> Zod schema -> TanStack Query cache -> page/component render
```

Backend side effects remain backend-owned. The frontend only submits commands and displays durable projections.

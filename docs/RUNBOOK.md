# Runbook

## Local workflow

1. Start backend on `http://localhost:8080`.
2. Run `npm ci`.
3. Copy `.env.example` to `.env.local` and adjust `VITE_API_BASE_URL` if needed.
4. Start frontend with `npm run dev`.
5. Open `http://localhost:5173`.

## Operator workflow

1. Check the header health pill. It should show `Backend UP`.
2. Submit a job from **Submit Job**.
3. Lookup by ID or idempotency key from **Lookup & Audit**.
4. Replay only jobs currently in backend `DLQ` state.

## Common errors

- `Backend unavailable`: check backend URL, CORS, Actuator and network path.
- `Invalid backend contract`: frontend received JSON that does not match the expected backend DTO shape.
- `Invalid JSON`: fix payload before submit.
- `Payload limit`: reduce request body size or store large payload externally and submit a reference.
- `Idempotency conflict`: same key was reused with a different command.
- `Replay rejected`: job is not in DLQ.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run e2e
npm run audit
```

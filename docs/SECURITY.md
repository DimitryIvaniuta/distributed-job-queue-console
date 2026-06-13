# Security Notes

## Implemented

- No `dangerouslySetInnerHTML`.
- Backend URL allows only `http` and `https` protocols.
- API requests use timeout and request correlation headers.
- Backend responses are runtime-validated with Zod.
- Nginx sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and CSP.
- No tokens are stored in localStorage or sessionStorage.
- Payload size guardrail blocks accidental huge JSON submissions.
- CI runs lint, strict type-check, tests, production build, e2e and high-severity npm audit.

## Before public exposure

- Put the console behind SSO and network controls.
- Prefer OIDC Authorization Code + PKCE.
- Use HTTPS only.
- Restrict backend CORS to the deployed frontend origin.
- Monitor CSP violations and API error rates.

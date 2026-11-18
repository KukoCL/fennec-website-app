# fennec-website-app

**Version:** 1.1.2
**Last Deploy:** April 15, 2026
**Status:** 🚀 Active

Front repository for FennecSoft website built with Vue 3, TypeScript, and Vite. Features a responsive design with multi-language support and contact form integration.

## Quick Info

- **Framework:** Vue 3 + TypeScript
- **Build Tool:** Vite
- **Deployment:** GitHub Pages (automated via GitHub Actions)
- **Domain URL:** <https://www.fennecsoft.cl>
- **Contact Form:** AWS integration with local development simulation

## Private Jumbo telemetry dashboard

Routes use the existing hash router:

- `/#/login`: FennecSoft email/password sign-in.
- `/#/dashboard`: authenticated simulator portal (only Jumbo is configured).
- `/#/dashboard/jumbo`: telemetry, local observation map, and permission-gated device activation.

The frontend never receives an Auth bearer token, Quest admin key or AWS credentials.
The Websites API BFF owns the `HttpOnly`, `Secure`, `SameSite=Strict` session cookie.
Session metadata and the CSRF nonce remain in memory, never local/session storage.
The app restores the cookie session on reload and renews it about five minutes before expiry.
A server-side role check is required; the route guard is not the security boundary.

### Configuration

Copy `.env.example` to `.env.local` for development. Set the public
`VITE_PORTAL_API_BASE_URL` to the BFF base URL, without a trailing slash.
For CI, configure the repository variable of the same name. This is **not a secret**.
Do not put Auth keys, Quest admin keys, or AWS credentials in any `VITE_*` variable.
Without a BFF URL, login fails closed with a configuration message. No demo data or fake login is enabled.

Production requires an HTTPS API hostname under the same site as `www.fennecsoft.cl`
(for example, a separately provisioned `api.fennecsoft.cl`). An AWS `execute-api` hostname
is cross-site and does not work with the strict session cookie. The example is not a provisioned endpoint.
The BFF must allow the exact frontend origin in its credentialed CORS configuration.
For local development, use the same hostname for both ports (do not mix `localhost` and `127.0.0.1`).
Any non-secure development cookie must be enabled only in the BFF Development environment.

BFF contract:

- `POST /dashboard/session` with `{ email, password }` returns
  `{ user: { id, email, roles }, expiresAtUtc, csrfToken, canManageActivation }`.
- `GET /dashboard/session` returns the same metadata or `401`.
- `POST /dashboard/session/refresh` and `POST /dashboard/session/logout` require `X-Dashboard-CSRF`.
- `GET /dashboard/telemetry/devices?cursor=...` returns
  `{ devices: [{ deviceId, active, locationEnabled }], nextCursor, historicalInventoryVerified }`.
- `GET /dashboard/telemetry/daily-usage?deviceId=...` returns retained daily summaries.

### Reading the telemetry

The dashboard paginates the available device inventory, then queries only one selected device.
Date presets are today, yesterday, last 7/30 days, and a custom inclusive range (maximum 90 days).
Dates and first/last observation times are UTC. Reported daily totals come from
`totalDurationSeconds`, not the gap between first and last observation. They are not session counts.
The browser caches one device history for at most 60 seconds to avoid repeated expensive reads;
changing date filters uses that history and preserves the actual last-fetch timestamp.

Missing records are not confirmed zero usage. The inventory warning remains visible when
`historicalInventoryVerified` is false. `active` means enabled, not online; IDs do not identify
hardware models. First/last locations are optional reported observations, not continuous tracking.
The map uses bundled Natural Earth public-domain land geometry and local SVG projection. It sends
no coordinates, bounding boxes, tile requests or geocoding requests to external services.
It is a coarse world reference map, not street-level mapping or a navigation aid.
First and last locations have different markers; overlapping points remain individually selectable.
Coordinates, observation/receipt timestamps in UTC and reported accuracy are shown without inventing missing values.

### Authorized activation

Only a session whose server-supplied `canManageActivation` is true exposes the control.
The BFF independently verifies current viewer and operator permissions; hiding the UI is not authorization.
Every change opens a separate confirmation naming the exact device ID and previous/requested states.
Cancel makes no request. Pending changes disable repeated submission; successful state updates use
only the confirmed BFF response and display its audit reference.

- `PUT /dashboard/telemetry/devices/{encodedDeviceId}/activation` with
  `{ active: boolean, expectedActive: boolean }`, the session cookie and `X-Dashboard-CSRF`.
- Success: `200 { deviceId, active, previousActive, auditId }`.
- `409 activation_conflict`: state changed since the UI read.
  `409 activation_busy`: a change is in progress or its result is still pending. `404`: ID not present in the available inventory.
- `503` with `code: activation_outcome_unknown`, a client timeout or connection failure may mean the
  write applied. The UI does not retry or optimistically toggle. It requires an explicit inventory
  refresh before another confirmation. No batch activation is implemented.

`active` is authorization, not connectivity. An offline client may not receive a change immediately;
this is not an emergency stop. The upstream API has no compare-and-swap, so the precondition check
cannot eliminate races between different operators. Review the last confirmed state and audit record.

### Simulator scope

`simulatorCatalog` is a presentation-only navigation catalog containing Jumbo. Its `navigationKey`
is not a backend `simulatorId`, and the client never sends it as a filter or authorization scope.
The current telemetry API does not include simulator IDs or partition records by simulator;
the portal discloses this limitation rather than assigning historical devices to a simulator.
Adding another simulator requires a real backend identity, ingestion/storage partition and per-simulator
authorization before adding its navigation entry. No additional simulators or IDs are invented.

### Verification

```sh
npm ci
npm run test:unit -- --run
npx eslint .
npm run type-check
npm run build
```

PR CI runs checks/build only. Production publication remains the existing version-tag workflow.
Backend provisioning, same-site domain/CORS, role assignment and end-to-end environment testing
must be completed before release. A frontend build alone does not make authentication operational.

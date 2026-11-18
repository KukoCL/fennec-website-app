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
- `/#/dashboard/jumbo`: telemetry, optional Google Maps/local fallback, and permission-gated device activation.

One published website offers a QA/Prod selector on sign-in, the simulator portal and the dashboard.
It starts in QA unless restoring a valid tab session. The environment is prominent in the dashboard,
activation control and its confirmation. Switching first revokes the previous session, clears tab
credentials, cached inventory/history and map-sharing consent, then requires a new sign-in. If
revocation is unavailable, the environment does not change. A pending activation disables switching.

The frontend never receives a central Auth JWT, Quest admin key or AWS credentials.
The BFF calls the same FennecSoft Auth service used by `vue-3-website-template`, but it keeps the
central Auth session server-side. The browser receives a separate revocable opaque dashboard token.
This credential is retained in **sessionStorage for this tab**, not localStorage, to survive reloads.
Restoration requires matching frontend origin, exact BFF base URL, environment and unexpired time,
then a successful `GET /dashboard/session` server validation. User metadata and the CSRF nonce remain
in memory. Refresh updates the stored expiry, with the BFF enforcing its absolute lifetime.

Same-origin JavaScript, including injected code, can read sessionStorage. This is an intentional
tradeoff for reload persistence without cross-site cookies. Browser tab/session restoration may
also restore sessionStorage; closing a tab is not guaranteed server logout. Explicit sign-out
revokes the server session and clears storage. Expiry/revocation on the server is authoritative.
When storage is blocked or fails, the session works in memory and a visible warning explains that
reload will require sign-in again. A server-side role check remains required; the route guard is
not the security boundary.

### Configuration

Copy `.env.example` to `.env.local` for development. Configure public endpoint URLs:

- `VITE_DASHBOARD_API_BASE_URL_QA`
- `VITE_DASHBOARD_API_BASE_URL_PROD`
- optionally `VITE_GOOGLE_MAPS_EMBED_API_KEY` (see mapping below).

Use the same names as repository variables for CI. These values are public, **not secrets**.
Use the BFF's HTTPS AWS `execute-api` URL including its stage, with no trailing slash; no custom
domain is required. The two URLs must differ. Each BFF is bound server-side to its own QA or Prod
Auth, Quest upstreams, session table and secrets. The frontend cannot choose an arbitrary upstream
or change a session's scope with a query parameter. Production must not fall back to QA.
Do not put Auth keys/JWTs, Quest admin keys, or AWS credentials in any `VITE_*` variable.
Without a selected environment's BFF URL, login fails closed; no demo login/data is enabled.

Requests use `Authorization: Bearer <opaque dashboard token>`, `credentials: omit`, no redirects
and no browser cache. This avoids third-party cookie dependence from the FennecSoft website to
`execute-api`. Configure each BFF's exact frontend origin and allow `Authorization`, `Content-Type`
and `X-Dashboard-CSRF` in CORS. For development use the same hostname for both ports (do not mix
`localhost` and `127.0.0.1`). HTTP is accepted only for loopback development endpoints.

BFF contract, unchanged paths in both deployments:

- `POST /dashboard/session` with `{ email, password }` returns
  `{ user: { id, email, roles }, environment: "qa" | "prod", expiresAtUtc, csrfToken, canManageActivation, accessToken }`.
  `accessToken` is opaque, 64 lowercase hex characters. The returned environment must match the selected endpoint.
- `GET /dashboard/session` returns the same metadata **without accessToken**, or `401`.
- `POST /dashboard/session/refresh` returns metadata without accessToken. The opaque token stays fixed.
- `POST /dashboard/session/logout` revokes the opaque token. Refresh/logout require `X-Dashboard-CSRF` as well as bearer.
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
### Optional Google Maps, local fallback

The default map uses bundled Natural Earth public-domain land geometry and local SVG projection.
It makes no map/tile/geocoding requests and sends no location data to a map provider. It is a coarse
reference map, not street-level mapping or a navigation aid.

With `VITE_GOOGLE_MAPS_EMBED_API_KEY` configured, the user can explicitly load Google Maps after a
privacy disclosure. Maps Embed `place` mode shows a street map with **one selected observation at a
time**, not every marker simultaneously. The selector keeps every first/last observation separately
accessible, including overlapping positions. No continuous route, inferred location or accuracy is
invented. Coordinates, observation/receipt timestamps in UTC and reported accuracy remain visible.

The Google iframe sends the selected coordinates, client IP and website origin to Google; later
observation selections in that view also load Google. Device IDs, timestamps, Auth/session tokens
and admin credentials are not included in its URL. New history/device/environment data resets the
opt-in. A manual “Return to local map” removes the iframe. The app cannot inspect a cross-origin
iframe to distinguish a working map from key/billing/CSP/network errors. The local map remains
available even if Google is blocked, and missing configuration never loads Google.

Before enabling Google Maps:

1. Create a Google Cloud project, enable **Maps Embed API**, and configure billing as required by
   Google's setup flow. Use a dedicated **browser** API key restricted to Maps Embed API and approved
   website HTTP referrers (production origin and only the intended development origins). The key is
   public in the built app, so it must not be an unrestricted/server key.
2. Review the [Maps Embed setup](https://developers.google.com/maps/documentation/embed/get-api-key),
   [embedding guide](https://developers.google.com/maps/documentation/embed/embedding-map) and
   [security guidance](https://developers.google.com/maps/api-security-best-practices). The iframe uses
   `strict-origin-when-cross-origin` so key restrictions receive only the site's origin, not page data.
3. Per Google's [Embed billing documentation](https://developers.google.com/maps/documentation/embed/usage-and-billing)
   checked 2026-11-18, Embed usage is available at no charge with unlimited requests. This implementation
   does not load the separately billed Maps JavaScript, Places, Routes or Geocoding APIs. Verify current
   terms/prices before enabling billing; no Google project, key or billing account was created here.
4. Review location-sharing authority, Google's [privacy policy](https://policies.google.com/privacy) and
   [Maps terms](https://www.google.com/intl/en/help/terms_maps/), plus the site's privacy/terms notices.
   Keep provider attribution visible and permit the Google iframe in any deployed CSP. Test a restricted
   key on the final origin; no live Google Maps rendering was verified without a key.

### Authorized activation

Only a session whose server-supplied `canManageActivation` is true exposes the control.
The BFF independently verifies current viewer and operator permissions; hiding the UI is not authorization.
Every change opens a separate confirmation naming the exact device ID and previous/requested states.
Cancel makes no request. Pending changes disable repeated submission; successful state updates use
only the confirmed BFF response and display its audit reference.

- `PUT /dashboard/telemetry/devices/{encodedDeviceId}/activation` with
  `{ active: boolean, expectedActive: boolean }`, the environment-scoped opaque bearer and `X-Dashboard-CSRF`.
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

Optional local integration, with the sibling `fennecsoft-website-lambda` checkout's synthetic QA
and Prod hosts running (`dotnet run --project scripts/dashboard-smoke/DashboardSmoke.csproj -- --serve`
and a second process with `--serve --prod`, ports 5059/5062):

```sh
PORTAL_SYNTHETIC_SMOKE=1 npm run test:unit -- --run src/features/portal/__tests__/contract.integration.spec.ts
```

This opt-in test exercises the real frontend transport/store against synthetic HTTP BFFs: sign-in,
reads, refresh, reload restoration, old-session revocation, QA/Prod switching and sign-out. It does
not call AWS, Auth or Quest production services. The default unit suite skips it if the hosts are
not explicitly requested. jsdom's AbortSignal differs from Node fetch, so the smoke adapter omits
that signal; cancellation/timeouts are covered by isolated unit tests.

Local component/unit checks are not visual browser verification. The cloud browser could not
reach this executor's local development server (`ERR_CONNECTION_REFUSED`), so responsive layout,
actual browser CORS and live Google Maps with a restricted key still require review on a reachable
QA origin before release.

PR CI runs checks/build only. Production publication remains the existing version-tag workflow.
Backend provisioning, execute-api URLs/CORS, role assignment and end-to-end environment testing
must be completed before release. A frontend build alone does not make authentication operational.

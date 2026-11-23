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
- `/#/dashboard/jumbo`: telemetry, optional Google Maps/local fallback, and owner-authorized visor activation/blocking.

One published website on the existing FennecSoft domain offers a QA/Prod telemetry selector on
sign-in, the simulator portal and the dashboard. The existing website Lambda serves one dashboard
BFF and authenticates the configured owner account through FennecSoft Auth, without separate viewer
or operator roles. No new website, custom domain or temporary HTTPS endpoint is required.

The selector starts in QA unless this tab has a saved UI preference. Switching keeps the current
owner session, cancels/discards old reads, clears cached inventory/history and map-sharing consent,
then loads the selected environment. The environment remains prominent in the dashboard, activation
control and confirmation. A pending activation blocks switching, including from another portal view.

The frontend never receives a central Auth JWT, Quest admin key or AWS credentials.
The BFF calls the same FennecSoft Auth service used by `vue-3-website-template`, but it keeps the
central Auth session server-side. The browser receives a separate revocable opaque dashboard token.
This credential is retained in **sessionStorage for this tab**, not localStorage, to survive reloads.
Restoration requires matching frontend origin, exact BFF base URL and unexpired time,
then a successful `GET /dashboard/session` server validation. User metadata and the CSRF nonce remain
in memory. Refresh updates the stored expiry, with the BFF enforcing its absolute lifetime.

Same-origin JavaScript, including injected code, can read sessionStorage. This is an intentional
tradeoff for reload persistence without cross-site cookies. Browser tab/session restoration may
also restore sessionStorage; closing a tab is not guaranteed server logout. Explicit sign-out
revokes the server session and clears storage. Expiry/revocation on the server is authoritative.
When storage is blocked or fails, the session works in memory and a visible warning explains that
reload will require sign-in again. The BFF must independently enforce the configured owner account
on every request; the route guard is not the security boundary. Old deployment-scoped tab credentials
are discarded on upgrade, requiring sign-in once. The telemetry preference is stored separately and
is not an authentication scope.

### Configuration

Copy `.env.example` to `.env.local` for development. Configure the public endpoint URL:

- `VITE_DASHBOARD_API_BASE_URL` (one public URL for the existing website BFF)
- optionally `VITE_GOOGLE_MAPS_EMBED_API_KEY` (see mapping below).

Use the same names as repository variables for CI. These values are public, **not secrets**.
Use the existing website BFF's HTTPS AWS `execute-api` URL including its stage, with no trailing
slash; no custom domain is required. QA and Prod refer to the telemetry upstreams configured
server-side in this single Lambda, not separate frontend builds, logins or BFF deployments. The
browser can only choose the exact `qa` or `prod` values, never an arbitrary upstream URL. A missing
or invalid environment must fail closed on the server, never fall back to QA or Prod.
Do not put Auth keys/JWTs, Quest admin keys, or AWS credentials in any `VITE_*` variable.
Without the BFF URL, login fails closed; no demo login/data is enabled.

Requests use `Authorization: Bearer <opaque dashboard token>`, `credentials: omit`, no redirects
and no browser cache. This avoids third-party cookie dependence from the FennecSoft website to
`execute-api`. Configure the BFF's exact frontend origin and allow `Authorization`, `Content-Type`
and `X-Dashboard-CSRF` in CORS. For development use the same hostname for both ports (do not mix
`localhost` and `127.0.0.1`). HTTP is accepted only for loopback development endpoints.

BFF contract:

- `POST /dashboard/session` with `{ email, password }` returns
  `{ user: { id, email }, expiresAtUtc, csrfToken, accessToken }`.
  `accessToken` is opaque, 64 lowercase hex characters. The session is independent of telemetry
  selection. Extra legacy role, environment or capability fields are not used by the frontend.
- `GET /dashboard/session` returns the same metadata **without accessToken**, or `401`.
- `POST /dashboard/session/refresh` returns metadata without accessToken. The opaque token stays fixed.
- `POST /dashboard/session/logout` revokes the opaque token. Refresh/logout require `X-Dashboard-CSRF` as well as bearer.
- Every telemetry route requires exactly one `environment=qa|prod` query parameter.
- `GET /dashboard/telemetry/devices?environment=qa&cursor=...` returns
  `{ environment: "qa", devices: [{ deviceId, active, locationEnabled }], nextCursor, historicalInventoryVerified }`.
  A returned environment that differs from the request is rejected before showing inventory.
- `GET /dashboard/telemetry/daily-usage?environment=qa&deviceId=...` returns retained daily summaries
  in the existing array shape. Generation checks discard stale results after switching environments.

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

The authenticated owner can activate and block visors in either environment, without separate roles.
The BFF independently rechecks owner authorization; hiding the UI is not authorization.
Every change opens a separate confirmation naming the exact environment, device ID and previous/requested states.
Cancel makes no request. Pending changes disable repeated submission; successful state updates use
only the confirmed BFF response and display its audit reference.

- `PUT /dashboard/telemetry/devices/{encodedDeviceId}/activation?environment=qa` with
  `{ active: boolean, expectedActive: boolean }`, the owner-session opaque bearer and `X-Dashboard-CSRF`.
- Success: `200 { environment, deviceId, active, previousActive, auditId }`. The response must match the
  confirmed environment, ID and transition; otherwise the outcome requires inventory verification.
- `409 activation_conflict`: state changed since the UI read.
  `409 activation_busy`: a change is in progress or its result is still pending. `404`: ID not present in the available inventory.
- `503` with `code: activation_outcome_unknown`, a client timeout or connection failure may mean the
  write applied. The UI does not retry or optimistically toggle. It requires an explicit inventory
  refresh before another confirmation. No batch activation is implemented.

`active` is authorization, not connectivity. An offline client may not receive a change immediately;
this is not an emergency stop. The upstream API has no compare-and-swap, so the precondition check
cannot eliminate races with another owner tab or other administrative access. Review the last confirmed state and audit record.

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

Optional local integration, with the sibling `fennecsoft-website-lambda` checkout's single synthetic
website BFF running (`dotnet run --project scripts/dashboard-smoke/DashboardSmoke.csproj -- --serve`,
port 5059), configured with synthetic QA and Prod sources:

```sh
PORTAL_SYNTHETIC_SMOKE=1 npm run test:unit -- --run src/features/portal/__tests__/contract.integration.spec.ts
```

This opt-in test exercises the real frontend transport/store against one synthetic HTTP BFF: one sign-in,
reads in both environments with the same token, refresh, reload restoration, QA/Prod switching
without relogin and explicit sign-out/revocation. It does not call AWS, Auth or Quest production
services. The default unit suite skips it unless explicitly requested. jsdom's AbortSignal differs from Node fetch, so the smoke adapter omits
that signal; cancellation/timeouts are covered by isolated unit tests.

Local component/unit checks are not visual browser verification. Responsive layout, actual browser
CORS and live Google Maps with a restricted key require a separate browser check on the existing
website origin before release. No live Auth, AWS data or real device activation is used by these tests.

PR CI runs checks/build only. Production publication remains the existing version-tag workflow.
Backend configuration, the existing execute-api URL/CORS, owner allowlisting and end-to-end environment testing
must be completed before release. A frontend build alone does not make authentication operational.

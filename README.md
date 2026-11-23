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
- optionally `VITE_GOOGLE_MAPS_API_KEY` (see mapping below).

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
### Optional multipoint Google Maps, local fallback

The default map uses bundled Natural Earth public-domain land geometry and local SVG projection.
It makes no map/tile/geocoding requests and sends no locations to a map provider. It is a coarse
reference map, not street-level mapping or a navigation aid.

With the optional `VITE_GOOGLE_MAPS_API_KEY`, the existing dashboard offers Google Maps JavaScript
API after an explicit disclosure and click. The map fits **every valid first/last observation in
the selected device/date range**, not just the selected point. Invalid coordinates are excluded;
zero coordinates remain valid. Numbered controls match the observation selector. Exactly coincident
positions are grouped with `×N`; clicking cycles through the observations without moving their
coordinates. The selector also raises the selected marker above nearby overlapping markers. Each
observation's UTC timestamps and accuracy stay in the dashboard, not in the provider document.
There is no route, geocoding, inferred location, extra inventory read or cross-device aggregation.

**Sharing scope:** all displayed coordinates, the client IP and site origin can be received by
Google once the user opts in. Neither device IDs, dates, timestamps, accuracy, Auth/session tokens
nor admin credentials are passed to Google. No point data is placed in a URL, HTML attribute or
iframe source. A new device, filtered record set, history refresh or environment clears consent and
removes the provider frame. Selecting another point or changing UI language does not expand the
shared data. “Return to local map” destroys the frame; it cannot undo data already shared. Script
errors, authentication failure callbacks and timeouts return to the local map with a visible warning.
Not every tile/key/billing problem is detectable; the local-map control is always available.

**Isolation:** Google code runs only in `public/telemetry-google-map.html`, loaded by a real HTTP(S)
URL in an iframe with **`sandbox="allow-scripts"` only**. Do not add `allow-same-origin`, load the SDK
in the SPA, or replace the frame with `srcdoc`/a data URL. The frame requires both embedding and an
opaque `window.origin` before it can load Google, so direct or unsandboxed loading does not bootstrap
the SDK. It cannot read the authenticated SPA's DOM or sessionStorage. Parent and frame validate the
sender window and exact expected origin. Because the frame's origin is opaque, the parent must use
`postMessage(..., '*')` to its exact `contentWindow`; only the public browser key, language, numeric
positions and selected index are sent. Replies are restricted to state or a bounded index, not
arbitrary actions. This is an isolation boundary, not a promise that coordinates remain private
after opt-in.

Configuration and release checklist:

1. An authorized owner must provide a dedicated public **browser** key for **Maps JavaScript API**,
   with website HTTP-referrer restrictions covering only approved origins. The old
   `VITE_GOOGLE_MAPS_EMBED_API_KEY` is intentionally not reused: Embed-only keys cannot authorize the
   new API, which has different billing. Configure `VITE_GOOGLE_MAPS_API_KEY` in `.env.local` or the
   same-named GitHub repository variable. The workflow passes that public value to the build.
   Do not put server keys, Auth tokens, AWS credentials or Quest admin keys in `VITE_*` variables.
2. Review Google's [key setup](https://developers.google.com/maps/documentation/javascript/get-api-key),
   [SDK loader](https://developers.google.com/maps/documentation/javascript/load-maps-js-api), and
   [API security guidance](https://developers.google.com/maps/api-security-best-practices).
   The loader uses `auth_referrer_policy=origin` and `strict-origin-when-cross-origin`; restrictions
   must match the website origin without a path. Allow only the intended production hostname and
   explicit development origins/ports, not a wildcard over unrelated sites.
3. Maps JavaScript map loads use the **Dynamic Maps** SKU and require billing. Review the current
   [usage and billing](https://developers.google.com/maps/documentation/javascript/usage-and-billing)
   and linked prices, quotas and alerts before enabling. Reopening the Google view creates another
   map instance and can incur another map load. Places, Geocoding, Routes and Street View are not
   loaded. No Google project, key, account or billing changes are made by this code.
4. This uses the quarterly SDK channel, raster maps and supported
   [OverlayView](https://developers.google.com/maps/documentation/javascript/customoverlays) controls,
   not deprecated `Marker`. No map ID or cloud map-style resource is required. Keep Google's map
   attribution visible. Review the [CSP guide](https://developers.google.com/maps/documentation/javascript/content-security-policy)
   if a hosting policy restricts the static frame, its classic local script, or Google's resources.
5. Review location-sharing authority, Google's [privacy policy](https://policies.google.com/privacy),
   [Maps terms](https://www.google.com/intl/en/help/terms_maps/) and the site's notices.
6. **Real-key acceptance check, still required:** on the final HTTPS origin with synthetic points,
   verify that a website-restricted key works inside the opaque sandbox in supported browsers.
   Google warns that browsers can omit referrers for opaque/local content. This frame deliberately
   uses an HTTP(S) `src`, not `srcdoc`/data, but mocks cannot prove Google's authorization behavior.
   If restrictions fail, keep the local fallback enabled and diagnose the referrer/CSP. **Do not
   remove key restrictions or weaken the sandbox.** Verify zero Google requests before opt-in,
   multi-point fitting, coincident and nearby-point selection, narrow-screen/keyboard operation,
   reset on device/date/environment/refresh, return-to-local, and blocked/invalid-key behavior.
   Do not use live telemetry or a real dashboard token in the provider tests.

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

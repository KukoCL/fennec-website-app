export type PortalErrorCode =
  | 'configuration'
  | 'invalidCredentials'
  | 'sessionExpired'
  | 'forbidden'
  | 'unavailable'
  | 'activationConflict'
  | 'activationBusy'
  | 'deviceMissing'
  | 'activationUnknown'
export class PortalError extends Error {
  constructor(
    public code: PortalErrorCode,
    public status?: number,
  ) {
    super(code)
  }
}
export type TelemetryEnvironment = 'qa' | 'prod'
export interface DashboardSession {
  environment: TelemetryEnvironment
  user: { id: string; email: string; roles: string[] }
  csrfToken: string
  expiresAtUtc: string
  canManageActivation?: boolean
}
export interface DeviceSummary {
  deviceId: string
  active: boolean
  locationEnabled: boolean
}
export interface DevicePage {
  devices: DeviceSummary[]
  nextCursor: string | null
  historicalInventoryVerified: boolean
}
export interface UsageObservation {
  occurredAtUtc: string
  receivedAtUtc: string
  location: { latitude: number; longitude: number; accuracyMeters?: number | null } | null
}
export interface DailyUsage {
  deviceId: string
  date: string
  first: UsageObservation | null
  last: UsageObservation | null
  totalDurationSeconds: number
}
export interface ActivationResult {
  deviceId: string
  active: boolean
  previousActive: boolean
  auditId: string
}
interface StoredSession {
  environment: TelemetryEnvironment
  accessToken: string
  expiresAtUtc: string
  apiBaseUrl: string
  origin: string
}
const storageKey = 'fennec:dashboard:session:v1'
let transport: { environment: TelemetryEnvironment; token: string } | null = null
let generation = 0
let restorationAttempted = false
let persisted = false
export function sessionPersistsOnReload() {
  return persisted
}
function removeStoredSession() {
  try {
    sessionStorage.removeItem(storageKey)
  } catch {
    /* Server revocation remains authoritative. */
  }
  persisted = false
}
export function clearSessionTransport() {
  transport = null
  generation++
  restorationAttempted = true
  removeStoredSession()
}
function persistSession(environment: TelemetryEnvironment, token: string, expiresAtUtc: string) {
  const stored: StoredSession = {
    environment,
    accessToken: token,
    expiresAtUtc,
    apiBaseUrl: baseUrl(environment),
    origin: window.location.origin,
  }
  if (!Number.isFinite(Date.parse(expiresAtUtc)) || Date.parse(expiresAtUtc) <= Date.now()) {
    clearSessionTransport()
    throw new PortalError('sessionExpired')
  }
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(stored))
    persisted = sessionStorage.getItem(storageKey) === JSON.stringify(stored)
    if (!persisted) removeStoredSession()
  } catch {
    removeStoredSession()
  }
}
export function restoreSessionEnvironment(): TelemetryEnvironment {
  if (restorationAttempted) return transport?.environment ?? 'qa'
  restorationAttempted = true
  try {
    const raw = sessionStorage.getItem(storageKey)
    if (!raw) return 'qa'
    const value: StoredSession = JSON.parse(raw)
    if (
      !value ||
      !['qa', 'prod'].includes(value.environment) ||
      !/^[a-f0-9]{64}$/.test(value.accessToken) ||
      value.apiBaseUrl !== baseUrl(value.environment) ||
      value.origin !== window.location.origin ||
      !Number.isFinite(Date.parse(value.expiresAtUtc)) ||
      Date.parse(value.expiresAtUtc) <= Date.now()
    ) {
      removeStoredSession()
      return 'qa'
    }
    transport = { environment: value.environment, token: value.accessToken }
    persisted = true
    return value.environment
  } catch {
    removeStoredSession()
    return 'qa'
  }
}
function baseUrl(environment: TelemetryEnvironment): string {
  const value = (
    environment === 'prod'
      ? import.meta.env.VITE_DASHBOARD_API_BASE_URL_PROD
      : import.meta.env.VITE_DASHBOARD_API_BASE_URL_QA
  )
    ?.trim()
    .replace(/\/$/, '')
  if (!value) throw new PortalError('configuration')
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new PortalError('configuration')
  }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if (
    (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  )
    throw new PortalError('configuration')
  const other = (
    environment === 'prod'
      ? import.meta.env.VITE_DASHBOARD_API_BASE_URL_QA
      : import.meta.env.VITE_DASHBOARD_API_BASE_URL_PROD
  )
    ?.trim()
    .replace(/\/$/, '')
  if (value === other) throw new PortalError('configuration')
  return value
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  login = false,
  activation = false,
  environment: TelemetryEnvironment = 'qa',
): Promise<T> {
  const url = baseUrl(environment)
  const token = transport?.environment === environment ? transport.token : null
  if (!login && !token) throw new PortalError('sessionExpired')
  const controller = new AbortController()
  const cancel = () => controller.abort()
  options.signal?.addEventListener('abort', cancel, { once: true })
  if (options.signal?.aborted) controller.abort()
  const timeout = setTimeout(cancel, 20_000)
  try {
    let response: Response
    try {
      response = await fetch(`${url}${path}`, {
        ...options,
        signal: controller.signal,
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        redirect: 'error',
        headers: { ...options.headers, ...(!login && token ? { Authorization: `Bearer ${token}` } : {}) },
      })
    } catch {
      if (options.signal?.aborted) throw new DOMException('Request cancelled', 'AbortError')
      throw new PortalError(activation ? 'activationUnknown' : 'unavailable')
    }
    if (!response.ok) {
      let problemCode: unknown
      try {
        problemCode = (await response.json())?.code
      } catch {
        /* No error body required. */
      }
      const code: PortalErrorCode =
        activation && response.status === 409
          ? problemCode === 'activation_busy'
            ? 'activationBusy'
            : 'activationConflict'
          : activation && response.status === 404
            ? 'deviceMissing'
            : activation && problemCode === 'activation_outcome_unknown'
              ? 'activationUnknown'
              : response.status === 401
                ? login
                  ? 'invalidCredentials'
                  : 'sessionExpired'
                : response.status === 403
                  ? 'forbidden'
                  : 'unavailable'
      throw new PortalError(code, response.status)
    }
    if (response.status === 204) return undefined as T
    try {
      return (await response.json()) as T
    } catch {
      throw new PortalError(activation ? 'activationUnknown' : 'unavailable')
    }
  } finally {
    clearTimeout(timeout)
    options.signal?.removeEventListener('abort', cancel)
  }
}
function sessionMetadata(result: DashboardSession, environment: TelemetryEnvironment): DashboardSession {
  if (result.environment !== environment) throw new PortalError('forbidden')
  // Keep the opaque transport credential out of reactive metadata/devtools.
  return {
    user: result.user,
    environment: result.environment,
    expiresAtUtc: result.expiresAtUtc,
    csrfToken: result.csrfToken,
    canManageActivation: result.canManageActivation,
  }
}
export const portalApi = {
  session: async (environment: TelemetryEnvironment = 'qa') =>
    sessionMetadata(await request<DashboardSession>('/dashboard/session', {}, false, false, environment), environment),
  login: async (email: string, password: string, environment: TelemetryEnvironment = 'qa') => {
    clearSessionTransport()
    const current = generation
    const result = await request<DashboardSession & { accessToken: string }>(
      '/dashboard/session',
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) },
      true,
      false,
      environment,
    )
    const metadata = sessionMetadata(result, environment)
    if (!/^[a-f0-9]{64}$/.test(result.accessToken)) throw new PortalError('unavailable')
    if (current !== generation) throw new DOMException('Login cancelled', 'AbortError')
    transport = { environment, token: result.accessToken }
    persistSession(environment, result.accessToken, result.expiresAtUtc)
    return metadata
  },
  refresh: async (csrfToken: string, environment: TelemetryEnvironment = 'qa') => {
    const current = generation
    const metadata = sessionMetadata(
      await request<DashboardSession>(
        '/dashboard/session/refresh',
        {
          method: 'POST',
          headers: { 'X-Dashboard-CSRF': csrfToken },
        },
        false,
        false,
        environment,
      ),
      environment,
    )
    if (current === generation && transport?.environment === environment)
      persistSession(environment, transport.token, metadata.expiresAtUtc)
    return metadata
  },
  logout: (csrfToken: string, environment: TelemetryEnvironment = 'qa') =>
    request<void>(
      '/dashboard/session/logout',
      {
        method: 'POST',
        headers: { 'X-Dashboard-CSRF': csrfToken },
      },
      false,
      false,
      environment,
    ),
  devices: (cursor?: string, signal?: AbortSignal, environment: TelemetryEnvironment = 'qa') =>
    request<DevicePage>(
      `/dashboard/telemetry/devices${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`,
      {
        signal,
      },
      false,
      false,
      environment,
    ),
  setActivation: (
    deviceId: string,
    active: boolean,
    expectedActive: boolean,
    csrfToken: string,
    environment: TelemetryEnvironment = 'qa',
  ) =>
    request<ActivationResult>(
      `/dashboard/telemetry/devices/${encodeURIComponent(deviceId)}/activation`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Dashboard-CSRF': csrfToken },
        body: JSON.stringify({ active, expectedActive }),
      },
      false,
      true,
      environment,
    ),
  dailyUsage: (deviceId: string, signal?: AbortSignal, environment: TelemetryEnvironment = 'qa') =>
    request<DailyUsage[]>(
      `/dashboard/telemetry/daily-usage?deviceId=${encodeURIComponent(deviceId)}`,
      { signal },
      false,
      false,
      environment,
    ),
}

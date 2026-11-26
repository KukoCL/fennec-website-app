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
  user: { id: string; email: string }
  csrfToken: string
  expiresAtUtc: string
}
export interface DeviceSummary {
  deviceId: string
  active: boolean
  locationEnabled: boolean
  alias?: string | null
}
export interface DevicePage {
  environment: TelemetryEnvironment
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
  environment: TelemetryEnvironment
  deviceId: string
  active: boolean
  previousActive: boolean
  auditId: string
}
interface StoredSession {
  accessToken: string
  expiresAtUtc: string
  apiBaseUrl: string
  origin: string
}
const storageKey = 'fennec:dashboard:session:v2'
const environmentKey = 'fennec:dashboard:environment'
let transport: { token: string } | null = null
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
function persistSession(token: string, expiresAtUtc: string) {
  const stored: StoredSession = {
    accessToken: token,
    expiresAtUtc,
    apiBaseUrl: baseUrl(),
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
// Telemetry selection is a UI preference, never an authentication scope.
export function restoreTelemetryEnvironment(): TelemetryEnvironment {
  try {
    return sessionStorage.getItem(environmentKey) === 'prod' ? 'prod' : 'qa'
  } catch {
    return 'qa'
  }
}
export function selectTelemetryEnvironment(environment: TelemetryEnvironment) {
  if (!['qa', 'prod'].includes(environment)) throw new PortalError('configuration')
  try {
    sessionStorage.setItem(environmentKey, environment)
  } catch {
    /* Memory-only selection. */
  }
}
export function restoreSessionTransport() {
  if (restorationAttempted) return
  restorationAttempted = true
  try {
    // Old deployment-scoped credentials cannot be restored into the single-BFF session contract.
    sessionStorage.removeItem('fennec:dashboard:session:v1')
    const raw = sessionStorage.getItem(storageKey)
    if (!raw) return
    const value: StoredSession = JSON.parse(raw)
    if (
      !value ||
      !/^[a-f0-9]{64}$/.test(value.accessToken) ||
      value.apiBaseUrl !== baseUrl() ||
      value.origin !== window.location.origin ||
      !Number.isFinite(Date.parse(value.expiresAtUtc)) ||
      Date.parse(value.expiresAtUtc) <= Date.now()
    ) {
      removeStoredSession()
      return
    }
    transport = { token: value.accessToken }
    persisted = true
  } catch {
    removeStoredSession()
  }
}
function baseUrl(): string {
  const value = import.meta.env.VITE_DASHBOARD_API_BASE_URL?.trim().replace(/\/$/, '')
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
  return value
}

async function request<T>(path: string, options: RequestInit = {}, login = false, activation = false): Promise<T> {
  const url = baseUrl()
  const token = transport?.token
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
function sessionMetadata(result: DashboardSession): DashboardSession {
  if (!result.user?.id || !result.user.email || !result.csrfToken || !Number.isFinite(Date.parse(result.expiresAtUtc)))
    throw new PortalError('unavailable')
  // Keep opaque credentials and upstream roles out of reactive metadata/devtools.
  return {
    user: { id: result.user.id, email: result.user.email },
    expiresAtUtc: result.expiresAtUtc,
    csrfToken: result.csrfToken,
  }
}
function telemetryQuery(environment: TelemetryEnvironment): string {
  if (!['qa', 'prod'].includes(environment)) throw new PortalError('configuration')
  return `environment=${environment}`
}
export const portalApi = {
  session: async () => sessionMetadata(await request<DashboardSession>('/dashboard/session')),
  login: async (email: string, password: string) => {
    clearSessionTransport()
    const current = generation
    const result = await request<DashboardSession & { accessToken: string }>(
      '/dashboard/session',
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) },
      true,
    )
    const metadata = sessionMetadata(result)
    if (!/^[a-f0-9]{64}$/.test(result.accessToken)) throw new PortalError('unavailable')
    if (current !== generation) throw new DOMException('Login cancelled', 'AbortError')
    transport = { token: result.accessToken }
    persistSession(result.accessToken, result.expiresAtUtc)
    return metadata
  },
  refresh: async (csrfToken: string) => {
    const current = generation
    const metadata = sessionMetadata(
      await request<DashboardSession>('/dashboard/session/refresh', {
        method: 'POST',
        headers: { 'X-Dashboard-CSRF': csrfToken },
      }),
    )
    if (current === generation && transport) persistSession(transport.token, metadata.expiresAtUtc)
    return metadata
  },
  logout: (csrfToken: string) =>
    request<void>('/dashboard/session/logout', {
      method: 'POST',
      headers: { 'X-Dashboard-CSRF': csrfToken },
    }),
  devices: (cursor: string | undefined, signal: AbortSignal | undefined, environment: TelemetryEnvironment) =>
    request<DevicePage>(
      `/dashboard/telemetry/devices?${telemetryQuery(environment)}` +
        (cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''),
      { signal },
    ).then((result) => {
      if (result.environment !== environment) throw new PortalError('unavailable')
      return result
    }),
  setDeviceAlias: (deviceId: string, alias: string | null, csrfToken: string, environment: TelemetryEnvironment) =>
    request<{ environment: TelemetryEnvironment; deviceId: string; alias: string | null }>(
      `/dashboard/telemetry/devices/${encodeURIComponent(deviceId)}/alias?${telemetryQuery(environment)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Dashboard-CSRF': csrfToken },
        body: JSON.stringify({ alias }),
      },
    ).then((result) => {
      if (result?.environment !== environment || result.deviceId !== deviceId || result.alias !== alias)
        throw new PortalError('unavailable')
      return result
    }),
  setActivation: (
    deviceId: string,
    active: boolean,
    expectedActive: boolean,
    csrfToken: string,
    environment: TelemetryEnvironment,
  ) =>
    request<ActivationResult>(
      `/dashboard/telemetry/devices/${encodeURIComponent(deviceId)}/activation?${telemetryQuery(environment)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Dashboard-CSRF': csrfToken },
        body: JSON.stringify({ active, expectedActive }),
      },
      false,
      true,
    ).then((result) => {
      if (result.environment !== environment) throw new PortalError('activationUnknown')
      return result
    }),
  dailyUsage: (deviceId: string, signal: AbortSignal | undefined, environment: TelemetryEnvironment) =>
    request<DailyUsage[]>(
      `/dashboard/telemetry/daily-usage?${telemetryQuery(environment)}&deviceId=${encodeURIComponent(deviceId)}`,
      { signal },
    ),
}

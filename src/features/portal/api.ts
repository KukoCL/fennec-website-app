export type PortalErrorCode =
  | 'configuration' | 'invalidCredentials' | 'sessionExpired' | 'forbidden' | 'unavailable'
  | 'activationConflict' | 'activationBusy' | 'deviceMissing' | 'activationUnknown'
export class PortalError extends Error {
  constructor(
    public code: PortalErrorCode,
    public status?: number,
  ) {
    super(code)
  }
}
export interface DashboardSession {
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
const baseUrl = import.meta.env.VITE_PORTAL_API_BASE_URL?.replace(/\/$/, '')

async function request<T>(path: string, options: RequestInit = {}, login = false, activation = false): Promise<T> {
  if (!baseUrl) throw new PortalError('configuration')
  const controller = new AbortController()
  const cancel = () => controller.abort()
  options.signal?.addEventListener('abort', cancel, { once: true })
  if (options.signal?.aborted) controller.abort()
  const timeout = setTimeout(cancel, 20_000)
  try {
    let response: Response
    try {
      response = await fetch(`${baseUrl}${path}`, {
        ...options,
        signal: controller.signal,
        credentials: 'include',
        redirect: 'error',
        headers: { ...options.headers },
      })
    } catch {
      if (options.signal?.aborted) throw new DOMException('Request cancelled', 'AbortError')
      throw new PortalError(activation ? 'activationUnknown' : 'unavailable')
    }
    if (!response.ok) {
      let problemCode: unknown
      try { problemCode = (await response.json())?.code } catch { /* No error body required. */ }
      const code: PortalErrorCode = activation && response.status === 409
        ? problemCode === 'activation_busy' ? 'activationBusy' : 'activationConflict'
        : activation && response.status === 404 ? 'deviceMissing'
          : activation && problemCode === 'activation_outcome_unknown' ? 'activationUnknown'
            : response.status === 401
              ? login ? 'invalidCredentials' : 'sessionExpired'
              : response.status === 403 ? 'forbidden' : 'unavailable'
      throw new PortalError(code, response.status)
    }
    if (response.status === 204) return undefined as T
    try { return await response.json() as T }
    catch { throw new PortalError(activation ? 'activationUnknown' : 'unavailable') }
  } finally {
    clearTimeout(timeout)
    options.signal?.removeEventListener('abort', cancel)
  }
}
export const portalApi = {
  session: () => request<DashboardSession>('/dashboard/session'),
  login: (email: string, password: string) =>
    request<DashboardSession>(
      '/dashboard/session',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      },
      true,
    ),
  refresh: (csrfToken: string) =>
    request<DashboardSession>('/dashboard/session/refresh', {
      method: 'POST',
      headers: { 'X-Dashboard-CSRF': csrfToken },
    }),
  logout: (csrfToken: string) =>
    request<void>('/dashboard/session/logout', {
      method: 'POST',
      headers: { 'X-Dashboard-CSRF': csrfToken },
    }),
  devices: (cursor?: string, signal?: AbortSignal) =>
    request<DevicePage>(`/dashboard/telemetry/devices${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`, {
      signal,
    }),
  setActivation: (deviceId: string, active: boolean, expectedActive: boolean, csrfToken: string) =>
    request<ActivationResult>(`/dashboard/telemetry/devices/${encodeURIComponent(deviceId)}/activation`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Dashboard-CSRF': csrfToken },
      body: JSON.stringify({ active, expectedActive }),
    }, false, true),
  dailyUsage: (deviceId: string, signal?: AbortSignal) =>
    request<DailyUsage[]>(`/dashboard/telemetry/daily-usage?deviceId=${encodeURIComponent(deviceId)}`, { signal }),
}

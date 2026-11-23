import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
const base = 'https://website-id.execute-api.us-east-1.amazonaws.com/prod'
const token = 'a'.repeat(64)
const storageKey = 'fennec:dashboard:session:v2'
const metadata = {
  user: { id: 'test', email: 'test@example.com' },
  csrfToken: 'nonce',
  expiresAtUtc: '2026-12-01T00:00:00Z',
}
const ok = (value: unknown) => ({ ok: true, status: 200, json: async () => value })
describe('single website BFF client', () => {
  const fetchMock = vi.fn()
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-18T10:00:00Z'))
    sessionStorage.clear()
    vi.resetModules()
    vi.stubEnv('VITE_DASHBOARD_API_BASE_URL', base)
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })
  async function authenticated() {
    const { portalApi } = await import('../api')
    fetchMock.mockResolvedValueOnce(ok({ ...metadata, accessToken: token }))
    await portalApi.login('test@example.com', 'password')
    fetchMock.mockClear()
    return portalApi
  }
  it('uses one sign-in without cookies, opaque tab credentials and no role/scope dependence', async () => {
    const { portalApi } = await import('../api')
    fetchMock.mockResolvedValueOnce(
      ok({
        ...metadata,
        accessToken: token,
        environment: 'qa',
        canManageActivation: true,
        user: { ...metadata.user, roles: ['legacy'] },
      }),
    )
    const result = await portalApi.login('test@example.com', 'password')
    expect(result).toEqual(metadata)
    expect(fetchMock).toHaveBeenCalledWith(
      `${base}/dashboard/session`,
      expect.objectContaining({
        credentials: 'omit',
        redirect: 'error',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
      }),
    )
    expect(fetchMock.mock.calls[0]?.[1].headers).not.toHaveProperty('Authorization')
    fetchMock.mockResolvedValueOnce(ok(metadata))
    await portalApi.session()
    expect(fetchMock.mock.calls[1]?.[1].headers.Authorization).toBe(`Bearer ${token}`)
    expect(localStorage.length).toBe(0)
    expect(JSON.parse(sessionStorage.getItem(storageKey)!)).toEqual({
      accessToken: token,
      expiresAtUtc: metadata.expiresAtUtc,
      apiBaseUrl: base,
      origin: window.location.origin,
    })
  })
  it('reuses the same bearer for explicit QA and Prod telemetry, never selects a second endpoint', async () => {
    const api = await authenticated()
    fetchMock.mockResolvedValue(ok([]))
    await api.dailyUsage('device', undefined, 'qa')
    await api.dailyUsage('device', undefined, 'prod')
    expect(fetchMock.mock.calls.map((call) => call[0])).toEqual([
      `${base}/dashboard/telemetry/daily-usage?environment=qa&deviceId=device`,
      `${base}/dashboard/telemetry/daily-usage?environment=prod&deviceId=device`,
    ])
    for (const call of fetchMock.mock.calls) expect(call[1].headers.Authorization).toBe(`Bearer ${token}`)
    const { clearSessionTransport } = await import('../api')
    clearSessionTransport()
    await expect(api.session()).rejects.toMatchObject({ code: 'sessionExpired' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
  it('rejects malformed or missing opaque tokens', async () => {
    const { portalApi } = await import('../api')
    for (const accessToken of ['', undefined, 'upstream.JWT', 'A'.repeat(64)]) {
      fetchMock.mockResolvedValueOnce(ok({ ...metadata, accessToken }))
      await expect(portalApi.login('e', 'p')).rejects.toMatchObject({ code: 'unavailable' })
    }
  })
  it('cannot restore a login response after sign-out interrupted it', async () => {
    const { portalApi, clearSessionTransport } = await import('../api')
    let resolve!: (value: ReturnType<typeof ok>) => void
    fetchMock.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done
      }),
    )
    const pending = portalApi.login('e', 'p')
    clearSessionTransport()
    resolve(ok({ ...metadata, accessToken: token }))
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
    await expect(portalApi.session()).rejects.toMatchObject({ code: 'sessionExpired' })
  })
  it('encodes device IDs and cursors and requires an exact allowlisted environment', async () => {
    const api = await authenticated()
    fetchMock.mockResolvedValueOnce(ok([]))
    await api.dailyUsage('device/?&other=bad', undefined, 'qa')
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${base}/dashboard/telemetry/daily-usage?environment=qa&deviceId=device%2F%3F%26other%3Dbad`,
    )
    fetchMock.mockResolvedValueOnce(ok({ environment: 'prod' }))
    await api.devices('cursor+/?', undefined, 'prod')
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      `${base}/dashboard/telemetry/devices?environment=prod&cursor=cursor%2B%2F%3F`,
    )
    for (const environment of [undefined, '', 'QA', 'Prod', 'qa&environment=prod', 'staging']) {
      // @ts-expect-error exercise runtime validation at the transport boundary
      expect(() => api.dailyUsage('device', undefined, environment)).toThrow('configuration')
    }
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
  it('rejects cross-environment inventory and ambiguous write responses', async () => {
    const api = await authenticated()
    fetchMock.mockResolvedValueOnce(ok({ environment: 'qa', devices: [] }))
    await expect(api.devices(undefined, undefined, 'prod')).rejects.toMatchObject({ code: 'unavailable' })
    fetchMock.mockResolvedValueOnce(ok({ environment: 'qa', deviceId: 'id', active: false }))
    await expect(api.setActivation('id', false, true, 'nonce', 'prod')).rejects.toMatchObject({
      code: 'activationUnknown',
    })
    fetchMock.mockResolvedValueOnce(ok({ devices: [] }))
    await expect(api.devices(undefined, undefined, 'qa')).rejects.toMatchObject({ code: 'unavailable' })
  })
  it('requires in-memory CSRF plus opaque bearer for logout without telemetry scope', async () => {
    const api = await authenticated()
    fetchMock.mockResolvedValue({ ok: true, status: 204 })
    await api.logout('nonce')
    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${base}/dashboard/session/logout`)
    expect(fetchMock.mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({
        method: 'POST',
        headers: { 'X-Dashboard-CSRF': 'nonce', Authorization: `Bearer ${token}` },
      }),
    )
  })
  it('distinguishes invalid credentials, expired sessions, forbidden access and outages', async () => {
    const { portalApi } = await import('../api')
    fetchMock.mockResolvedValue({ ok: false, status: 401 })
    await expect(portalApi.login('e', 'p')).rejects.toMatchObject({ code: 'invalidCredentials' })
    const api = await authenticated()
    fetchMock.mockResolvedValue({ ok: false, status: 401 })
    await expect(api.session()).rejects.toMatchObject({ code: 'sessionExpired' })
    fetchMock.mockResolvedValue({ ok: false, status: 403 })
    await expect(api.session()).rejects.toMatchObject({ code: 'forbidden' })
    fetchMock.mockResolvedValue({ ok: false, status: 503 })
    await expect(api.dailyUsage('device', undefined, 'qa')).rejects.toMatchObject({ code: 'unavailable' })
  })
  it('fails closed for missing or unsafe BFF URLs', async () => {
    const { portalApi } = await import('../api')
    for (const value of [
      '',
      'http://example.test',
      'https://user:password@example.test',
      `${base}?secret=x`,
      `${base}#hash`,
    ]) {
      vi.stubEnv('VITE_DASHBOARD_API_BASE_URL', value)
      await expect(portalApi.login('e', 'p')).rejects.toMatchObject({ code: 'configuration' })
    }
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('times out requests and cancels abandoned queries without retrying', async () => {
    const api = await authenticated()
    fetchMock.mockImplementation(
      (_url, options) =>
        new Promise((_resolve, reject) => {
          options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
        }),
    )
    const pending = api.session().catch((error: unknown) => error)
    await vi.advanceTimersByTimeAsync(20_000)
    expect(await pending).toMatchObject({ code: 'unavailable' })
    const controller = new AbortController()
    const abandoned = api.dailyUsage('device', controller.signal, 'qa').catch((error: unknown) => error)
    controller.abort()
    expect(await abandoned).toMatchObject({ name: 'AbortError' })
  })
  it.each(['qa', 'prod'] as const)(
    'sends one explicit single-device transition to %s with CSRF',
    async (environment) => {
      const api = await authenticated()
      fetchMock.mockResolvedValue(ok({ environment }))
      await api.setActivation('id/?', false, true, 'nonce', environment)
      expect(fetchMock.mock.calls[0]?.[0]).toBe(
        `${base}/dashboard/telemetry/devices/id%2F%3F/activation?environment=${environment}`,
      )
      expect(fetchMock.mock.calls[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'PUT',
          credentials: 'omit',
          headers: {
            'Content-Type': 'application/json',
            'X-Dashboard-CSRF': 'nonce',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ active: false, expectedActive: true }),
        }),
      )
    },
  )
  it('does not retry writes and distinguishes conflicts and ambiguous outcomes', async () => {
    const api = await authenticated()
    fetchMock.mockResolvedValueOnce({ ok: false, status: 409, json: async () => ({}) })
    await expect(api.setActivation('id', false, true, 'nonce', 'qa')).rejects.toMatchObject({
      code: 'activationConflict',
    })
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({ code: 'activation_outcome_unknown' }),
    })
    await expect(api.setActivation('id', false, true, 'nonce', 'qa')).rejects.toMatchObject({
      code: 'activationUnknown',
    })
    fetchMock.mockRejectedValueOnce(new TypeError('Network failed'))
    await expect(api.setActivation('id', false, true, 'nonce', 'qa')).rejects.toMatchObject({
      code: 'activationUnknown',
    })
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
  it('restores a valid tab credential at the same BFF independently of telemetry preference', async () => {
    await authenticated()
    const first = await import('../api')
    first.selectTelemetryEnvironment('prod')
    vi.resetModules()
    const reloaded = await import('../api')
    reloaded.restoreSessionTransport()
    expect(reloaded.restoreTelemetryEnvironment()).toBe('prod')
    fetchMock.mockResolvedValueOnce(ok(metadata))
    await reloaded.portalApi.session()
    expect(fetchMock.mock.calls[0]?.[1].headers.Authorization).toBe(`Bearer ${token}`)
    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${base}/dashboard/session`)
  })
  it('rejects invalid stored sessions and discards legacy credentials', async () => {
    const stored = {
      accessToken: token,
      expiresAtUtc: metadata.expiresAtUtc,
      apiBaseUrl: base,
      origin: window.location.origin,
    }
    for (const changed of [
      { expiresAtUtc: '2000-01-01T00:00:00Z' },
      { origin: 'https://other.test' },
      { apiBaseUrl: 'https://other.test' },
      { accessToken: 'upstream.JWT' },
    ]) {
      sessionStorage.setItem(storageKey, JSON.stringify({ ...stored, ...changed }))
      vi.resetModules()
      const reloaded = await import('../api')
      reloaded.restoreSessionTransport()
      await expect(reloaded.portalApi.session()).rejects.toMatchObject({ code: 'sessionExpired' })
      expect(sessionStorage.getItem(storageKey)).toBeNull()
    }
    sessionStorage.setItem('fennec:dashboard:session:v1', JSON.stringify({ ...stored, environment: 'qa' }))
    vi.resetModules()
    const reloaded = await import('../api')
    reloaded.restoreSessionTransport()
    await expect(reloaded.portalApi.session()).rejects.toMatchObject({ code: 'sessionExpired' })
    expect(sessionStorage.getItem('fennec:dashboard:session:v1')).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('keeps a successful login in memory if tab storage is unavailable', async () => {
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    const remove = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    try {
      const api = await authenticated()
      const module = await import('../api')
      expect(module.sessionPersistsOnReload()).toBe(false)
      fetchMock.mockResolvedValueOnce(ok(metadata))
      await expect(api.session()).resolves.toEqual(metadata)
      module.clearSessionTransport()
      await expect(api.session()).rejects.toMatchObject({ code: 'sessionExpired' })
    } finally {
      set.mockRestore()
      get.mockRestore()
      remove.mockRestore()
    }
  })
  it('updates the stored expiry only for the current session and removes it on clear', async () => {
    const api = await authenticated()
    const expiresAtUtc = '2026-12-02T00:00:00Z'
    fetchMock.mockResolvedValueOnce(ok({ ...metadata, expiresAtUtc }))
    await api.refresh('nonce')
    expect(JSON.parse(sessionStorage.getItem(storageKey)!).expiresAtUtc).toBe(expiresAtUtc)
    const module = await import('../api')
    module.clearSessionTransport()
    expect(sessionStorage.getItem(storageKey)).toBeNull()
    expect(module.sessionPersistsOnReload()).toBe(false)
  })
})

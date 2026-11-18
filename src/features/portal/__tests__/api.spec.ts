import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
const qa = 'https://qa-id.execute-api.us-east-1.amazonaws.com/qa'
const prod = 'https://prod-id.execute-api.us-east-1.amazonaws.com/prod'
const token = 'a'.repeat(64)
const metadata = {
  user: { id: 'test', email: 'test@example.com', roles: [] },
  environment: 'qa',
  csrfToken: 'nonce',
  expiresAtUtc: '2026-12-01T00:00:00Z',
  canManageActivation: false,
}
const ok = (value: unknown) => ({ ok: true, status: 200, json: async () => value })
describe('environment-isolated execute-api BFF client', () => {
  const fetchMock = vi.fn()
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-18T10:00:00Z'))
    sessionStorage.clear()
    vi.resetModules()
    vi.stubEnv('VITE_DASHBOARD_API_BASE_URL_QA', qa)
    vi.stubEnv('VITE_DASHBOARD_API_BASE_URL_PROD', prod)
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
    await portalApi.login('test@example.com', 'password', 'qa')
    fetchMock.mockClear()
    return portalApi
  }
  it('uses no cookies or localStorage and keeps the tab credential out of reactive metadata', async () => {
    try {
      const { portalApi } = await import('../api')
      fetchMock.mockResolvedValueOnce(ok({ ...metadata, accessToken: token }))
      const result = await portalApi.login('test@example.com', 'password', 'qa')
      expect(result).not.toHaveProperty('accessToken')
      expect(fetchMock).toHaveBeenCalledWith(
        `${qa}/dashboard/session`,
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
      await portalApi.session('qa')
      expect(fetchMock.mock.calls[1]?.[1].headers.Authorization).toBe(`Bearer ${token}`)
      expect(localStorage.length).toBe(0)
      expect(JSON.parse(sessionStorage.getItem('fennec:dashboard:session:v1')!).accessToken).toBe(token)
    } finally {
      /* No external credential persistence. */
    }
  })
  it('does not send QA credentials to Prod and requires sign-in after memory is cleared', async () => {
    const portalApi = await authenticated()
    await expect(portalApi.dailyUsage('device', undefined, 'prod')).rejects.toMatchObject({ code: 'sessionExpired' })
    expect(fetchMock).not.toHaveBeenCalled()
    const { clearSessionTransport } = await import('../api')
    clearSessionTransport()
    await expect(portalApi.session('qa')).rejects.toMatchObject({ code: 'sessionExpired' })
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('uses the selected Prod endpoint and rejects mismatched session scope', async () => {
    const { portalApi } = await import('../api')
    fetchMock.mockResolvedValueOnce(ok({ ...metadata, environment: 'prod', accessToken: token }))
    await portalApi.login('test@example.com', 'password', 'prod')
    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${prod}/dashboard/session`)
    fetchMock.mockResolvedValueOnce(ok(metadata))
    await expect(portalApi.session('prod')).rejects.toMatchObject({ code: 'forbidden' })
  })
  it('rejects mismatched login scope and malformed or missing opaque tokens', async () => {
    const { portalApi } = await import('../api')
    fetchMock.mockResolvedValueOnce(ok({ ...metadata, environment: 'prod', accessToken: token }))
    await expect(portalApi.login('e', 'p', 'qa')).rejects.toMatchObject({ code: 'forbidden' })
    for (const accessToken of ['', undefined, 'upstream.JWT', 'A'.repeat(64)]) {
      fetchMock.mockResolvedValueOnce(ok({ ...metadata, accessToken }))
      await expect(portalApi.login('e', 'p', 'qa')).rejects.toMatchObject({ code: 'unavailable' })
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
    const pending = portalApi.login('e', 'p', 'qa')
    clearSessionTransport()
    resolve(ok({ ...metadata, accessToken: token }))
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
    await expect(portalApi.session()).rejects.toMatchObject({ code: 'sessionExpired' })
  })
  it('encodes device IDs and cursors and sends no client-selected environment to upstream', async () => {
    const portalApi = await authenticated()
    fetchMock.mockResolvedValue(ok([]))
    await portalApi.dailyUsage('device/?&other=bad')
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `${qa}/dashboard/telemetry/daily-usage?deviceId=device%2F%3F%26other%3Dbad`,
    )
    await portalApi.devices('cursor+/?')
    expect(fetchMock.mock.calls[1]?.[0]).toContain('cursor=cursor%2B%2F%3F')
    expect(fetchMock.mock.calls[1]?.[0]).not.toContain('environment=')
  })
  it('requires in-memory CSRF plus opaque bearer for writes', async () => {
    const portalApi = await authenticated()
    fetchMock.mockResolvedValue({ ok: true, status: 204 })
    await portalApi.logout('nonce')
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
    await expect(api.dailyUsage('device')).rejects.toMatchObject({ code: 'unavailable' })
  })
  it('fails closed for missing, unsafe or identical environment URLs', async () => {
    const { portalApi } = await import('../api')
    for (const value of ['', 'http://example.test', 'https://user:password@example.test', `${qa}?secret=x`, prod]) {
      vi.stubEnv('VITE_DASHBOARD_API_BASE_URL_QA', value)
      await expect(portalApi.login('e', 'p')).rejects.toMatchObject({ code: 'configuration' })
    }
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('times out requests and cancels abandoned queries without retrying', async () => {
    const portalApi = await authenticated()
    vi.useFakeTimers()
    try {
      fetchMock.mockImplementation(
        (_url, options) =>
          new Promise((_resolve, reject) => {
            options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
          }),
      )
      const pending = portalApi.session().catch((error: unknown) => error)
      await vi.advanceTimersByTimeAsync(20_000)
      expect(await pending).toMatchObject({ code: 'unavailable' })
      const controller = new AbortController()
      const abandoned = portalApi.dailyUsage('device', controller.signal).catch((error: unknown) => error)
      controller.abort()
      expect(await abandoned).toMatchObject({ name: 'AbortError' })
    } finally {
      vi.useRealTimers()
    }
  })
  it('sends one explicit single-device transition with environment-isolated credentials', async () => {
    const portalApi = await authenticated()
    fetchMock.mockResolvedValue(ok({}))
    await portalApi.setActivation('id/?', false, true, 'nonce', 'qa')
    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${qa}/dashboard/telemetry/devices/id%2F%3F/activation`)
    expect(fetchMock.mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({
        method: 'PUT',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json', 'X-Dashboard-CSRF': 'nonce', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ active: false, expectedActive: true }),
      }),
    )
  })
  it('does not retry writes and distinguishes conflicts and ambiguous outcomes', async () => {
    const portalApi = await authenticated()
    fetchMock.mockResolvedValueOnce({ ok: false, status: 409, json: async () => ({}) })
    await expect(portalApi.setActivation('id', false, true, 'nonce')).rejects.toMatchObject({
      code: 'activationConflict',
    })
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({ code: 'activation_outcome_unknown' }),
    })
    await expect(portalApi.setActivation('id', false, true, 'nonce')).rejects.toMatchObject({
      code: 'activationUnknown',
    })
    fetchMock.mockRejectedValueOnce(new TypeError('Network failed'))
    await expect(portalApi.setActivation('id', false, true, 'nonce')).rejects.toMatchObject({
      code: 'activationUnknown',
    })
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
  it('restores only a valid tab record and verifies it with the selected BFF after reload', async () => {
    const api = await authenticated()
    expect(api).toBeDefined()
    vi.resetModules()
    const reloaded = await import('../api')
    expect(reloaded.restoreSessionEnvironment()).toBe('qa')
    fetchMock.mockResolvedValueOnce(ok(metadata))
    await reloaded.portalApi.session('qa')
    expect(fetchMock.mock.calls[0]?.[1].headers.Authorization).toBe(`Bearer ${token}`)
    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${qa}/dashboard/session`)
  })
  it('rejects expired, foreign-origin, foreign-endpoint, malformed and mismatched environment storage', async () => {
    const stored = {
      environment: 'qa',
      accessToken: token,
      expiresAtUtc: '2026-12-01T00:00:00Z',
      apiBaseUrl: qa,
      origin: window.location.origin,
    }
    for (const changed of [
      { expiresAtUtc: '2000-01-01T00:00:00Z' },
      { origin: 'https://other.test' },
      { apiBaseUrl: prod },
      { environment: 'staging' },
      { accessToken: 'upstream.JWT' },
      { environment: 'prod' },
    ]) {
      sessionStorage.setItem('fennec:dashboard:session:v1', JSON.stringify({ ...stored, ...changed }))
      vi.resetModules()
      const reloaded = await import('../api')
      expect(reloaded.restoreSessionEnvironment()).toBe('qa')
      await expect(reloaded.portalApi.session()).rejects.toMatchObject({ code: 'sessionExpired' })
      expect(sessionStorage.getItem('fennec:dashboard:session:v1')).toBeNull()
    }
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
      await expect(api.session()).resolves.toMatchObject({ environment: 'qa' })
      module.clearSessionTransport()
      await expect(api.session()).rejects.toMatchObject({ code: 'sessionExpired' })
    } finally {
      set.mockRestore()
      get.mockRestore()
      remove.mockRestore()
    }
  })
  it('updates the stored expiry only for the current session on refresh and removes it on clear', async () => {
    const api = await authenticated()
    const expiresAtUtc = '2026-12-02T00:00:00Z'
    fetchMock.mockResolvedValueOnce(ok({ ...metadata, expiresAtUtc }))
    await api.refresh('nonce')
    expect(JSON.parse(sessionStorage.getItem('fennec:dashboard:session:v1')!).expiresAtUtc).toBe(expiresAtUtc)
    const module = await import('../api')
    module.clearSessionTransport()
    expect(sessionStorage.getItem('fennec:dashboard:session:v1')).toBeNull()
    expect(module.sessionPersistsOnReload()).toBe(false)
  })
})

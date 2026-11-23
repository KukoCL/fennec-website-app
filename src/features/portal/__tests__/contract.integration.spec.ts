import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// Opt-in only: the sibling backend's single --serve synthetic host, no cloud data.
describe.skipIf(process.env.PORTAL_SYNTHETIC_SMOKE !== '1')('synthetic single-BFF QA/Prod contract', () => {
  const nativeFetch = globalThis.fetch
  beforeEach(() => {
    vi.resetModules()
    sessionStorage.clear()
    vi.stubEnv('VITE_DASHBOARD_API_BASE_URL', 'http://localhost:5059')
    // jsdom AbortSignal is not a Node fetch signal; abort/timeouts are covered separately.
    vi.stubGlobal('fetch', (input: RequestInfo | URL, init: RequestInit = {}) =>
      nativeFetch(input, { ...init, signal: undefined, headers: { ...init.headers, Origin: 'http://localhost:5173' } }),
    )
    setActivePinia(createPinia())
  })
  afterEach(() => {
    sessionStorage.clear()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })
  it('signs in once, reads both environments, refreshes, restores and explicitly revokes', async () => {
    const { useAuthStore } = await import('@/stores/authStore')
    const { portalApi } = await import('../api')
    const auth = useAuthStore()
    await auth.login('smoke@example.test', 'synthetic-only')
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.reloadSessionAvailable).toBe(true)
    expect(auth.session).not.toHaveProperty('environment')
    const page = await portalApi.devices(undefined, undefined, 'qa')
    expect(page.environment).toBe('qa')
    expect(page.devices.length).toBeGreaterThan(0)
    await expect(portalApi.dailyUsage(page.devices[0]!.deviceId, undefined, 'qa')).resolves.toBeInstanceOf(Array)
    const token = JSON.parse(sessionStorage.getItem('fennec:dashboard:session:v2')!).accessToken
    const before = auth.session
    auth.changeEnvironment('prod')
    expect(auth.session).toBe(before)
    expect(JSON.parse(sessionStorage.getItem('fennec:dashboard:session:v2')!).accessToken).toBe(token)
    const prodPage = await portalApi.devices(undefined, undefined, 'prod')
    expect(prodPage.environment).toBe('prod')
    expect(prodPage.devices.length).toBeGreaterThan(0)
    await expect(portalApi.dailyUsage(prodPage.devices[0]!.deviceId, undefined, 'prod')).resolves.toBeInstanceOf(Array)
    await auth.refreshSession()
    vi.resetModules()
    setActivePinia(createPinia())
    const reloaded = (await import('@/stores/authStore')).useAuthStore()
    expect(reloaded.environment).toBe('prod')
    expect(await reloaded.restoreSession()).toBe(true)
    expect(reloaded.session).not.toHaveProperty('environment')
    auth.changeEnvironment('qa')
    expect(auth.isAuthenticated).toBe(true)
    await reloaded.logout()
    expect(reloaded.session).toBeNull()
    expect(sessionStorage.getItem('fennec:dashboard:session:v2')).toBeNull()
    const revoked = await nativeFetch('http://localhost:5059/dashboard/session', {
      headers: { Origin: 'http://localhost:5173', Authorization: `Bearer ${token}` },
    })
    expect(revoked.status).toBe(401)
  })
})

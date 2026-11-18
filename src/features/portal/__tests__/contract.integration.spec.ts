import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

// Opt-in only: the sibling backend's --serve / --serve --prod synthetic hosts, no cloud data.
describe.skipIf(process.env.PORTAL_SYNTHETIC_SMOKE !== '1')('synthetic QA/Prod BFF contract', () => {
  const nativeFetch = globalThis.fetch;
  beforeEach(() => {
    vi.resetModules(); sessionStorage.clear();
    vi.stubEnv('VITE_DASHBOARD_API_BASE_URL_QA', 'http://localhost:5059');
    vi.stubEnv('VITE_DASHBOARD_API_BASE_URL_PROD', 'http://localhost:5062');
    // jsdom AbortSignal is not a Node fetch signal; abort/timeouts are covered separately.
    vi.stubGlobal('fetch', (input: RequestInfo | URL, init: RequestInit = {}) =>
      nativeFetch(input, { ...init, signal: undefined,
        headers: { ...init.headers, Origin: 'http://localhost:5173' } }));
    setActivePinia(createPinia());
  });
  afterEach(() => { sessionStorage.clear(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
  it('signs in, reads, restores, refreshes, revokes and switches without mixing environments', async () => {
    const { useAuthStore } = await import('@/stores/authStore');
    const { portalApi } = await import('../api');
    const auth = useAuthStore();
    await auth.login('browser-smoke@example.test', 'synthetic-only');
    expect(auth.session?.environment).toBe('qa'); expect(auth.reloadSessionAvailable).toBe(true);
    const page = await portalApi.devices(undefined, undefined, 'qa');
    expect(page.devices.length).toBeGreaterThan(0);
    await expect(portalApi.dailyUsage(page.devices[0]!.deviceId, undefined, 'qa')).resolves.toBeInstanceOf(Array);
    await expect(portalApi.devices(undefined, undefined, 'prod')).rejects.toMatchObject({ code: 'sessionExpired' });
    await auth.refreshSession();
    const qaToken = JSON.parse(sessionStorage.getItem('fennec:dashboard:session:v1')!).accessToken;
    await auth.changeEnvironment('prod');
    expect(auth.session).toBeNull(); expect(sessionStorage.length).toBe(0);
    const revoked = await nativeFetch('http://localhost:5059/dashboard/session', {
      headers: { Origin: 'http://localhost:5173', Authorization: `Bearer ${qaToken}` },
    }); expect(revoked.status).toBe(401);
    await auth.login('browser-smoke@example.test', 'synthetic-only');
    expect(auth.session?.environment).toBe('prod');
    vi.resetModules(); setActivePinia(createPinia());
    const reloaded = (await import('@/stores/authStore')).useAuthStore();
    expect(reloaded.environment).toBe('prod'); expect(await reloaded.restoreSession()).toBe(true);
    expect(reloaded.session?.environment).toBe('prod');
    const prodPage = await (await import('../api')).portalApi.devices(undefined, undefined, 'prod');
    expect(prodPage.devices.length).toBeGreaterThan(0);
    await reloaded.logout(); expect(reloaded.session).toBeNull(); expect(sessionStorage.length).toBe(0);
  });
});

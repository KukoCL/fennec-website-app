import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { portalApi, PortalError, type DashboardSession } from '@/features/portal/api'
import { useAuthStore } from '../authStore'
vi.mock('@/features/portal/api', async (original) => ({
  ...(await original<typeof import('@/features/portal/api')>()),
  portalApi: { session: vi.fn(), login: vi.fn(), logout: vi.fn(), refresh: vi.fn() },
}))
const session: DashboardSession = {
  user: { id: 'test', email: 'test@example.com', roles: ['telemetry'] },
  environment: 'qa',
  csrfToken: 'example-nonce',
  expiresAtUtc: '2026-11-17T12:00:00Z',
}
describe('private dashboard session', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })
  it('restores an in-memory session without using browser storage', async () => {
    const storage = vi.spyOn(Storage.prototype, 'setItem')
    vi.mocked(portalApi.session).mockResolvedValue(session)
    const auth = useAuthStore()
    await Promise.all([auth.restoreSession(), auth.restoreSession()])
    expect(portalApi.session).toHaveBeenCalledTimes(1)
    expect(auth.isAuthenticated).toBe(true)
    expect(storage).not.toHaveBeenCalled()
    storage.mockRestore()
  })
  it('preserves metadata on refresh outage and clears on 401', async () => {
    const auth = useAuthStore()
    auth.session = session
    vi.mocked(portalApi.refresh).mockRejectedValueOnce(new PortalError('unavailable', 503))
    await expect(auth.refreshSession()).rejects.toThrow()
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.refreshUnavailable).toBe(true)
    vi.mocked(portalApi.refresh).mockRejectedValueOnce(new PortalError('sessionExpired', 401))
    await expect(auth.refreshSession()).rejects.toThrow()
    expect(auth.isAuthenticated).toBe(false)
  })
  it('does not claim logout succeeded if the server could not revoke the dashboard session', async () => {
    const auth = useAuthStore()
    auth.session = session
    vi.mocked(portalApi.logout).mockRejectedValueOnce(new PortalError('unavailable'))
    await expect(auth.logout()).rejects.toThrow()
    expect(auth.isAuthenticated).toBe(true)
    vi.mocked(portalApi.logout).mockResolvedValueOnce()
    await auth.logout()
    expect(auth.isAuthenticated).toBe(false)
  })
  it('does not restore stale metadata after signing out', async () => {
    let resolve!: (value: DashboardSession) => void
    vi.mocked(portalApi.session).mockReturnValue(
      new Promise((done) => {
        resolve = done
      }),
    )
    const auth = useAuthStore()
    const pending = auth.restoreSession()
    auth.clearSession()
    resolve(session)
    await pending
    expect(auth.isAuthenticated).toBe(false)
  })
  it('ignores an anonymous restore rejection that arrives after a successful login', async () => {
    let reject!: (reason: unknown) => void
    vi.mocked(portalApi.session).mockReturnValue(
      new Promise((_done, fail) => {
        reject = fail
      }),
    )
    vi.mocked(portalApi.login).mockResolvedValue(session)
    const auth = useAuthStore()
    const initialRestore = auth.restoreSession()
    await auth.login('test@example.com', 'example-password')
    vi.mocked(portalApi.session).mockResolvedValueOnce(session)
    const guardRestore = auth.restoreSession()
    reject(new PortalError('sessionExpired', 401))
    expect(await initialRestore).toBe(true)
    expect(await guardRestore).toBe(true)
    expect(auth.isAuthenticated).toBe(true)
  })

  it('ignores a stale refresh rejection after a new login', async () => {
    let reject!: (reason: unknown) => void
    vi.mocked(portalApi.refresh).mockReturnValue(
      new Promise((_done, fail) => {
        reject = fail
      }),
    )
    vi.mocked(portalApi.login).mockResolvedValue(session)
    const auth = useAuthStore()
    auth.session = session
    const oldRefresh = auth.refreshSession()
    await auth.login('test@example.com', 'example-password')
    reject(new PortalError('sessionExpired', 401))
    await oldRefresh
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.refreshUnavailable).toBe(false)
  })

  it('does not erase a new login when an older logout finishes late', async () => {
    let resolve!: () => void
    vi.mocked(portalApi.logout).mockReturnValue(
      new Promise((done) => {
        resolve = done
      }),
    )
    vi.mocked(portalApi.login).mockResolvedValue(session)
    const auth = useAuthStore()
    auth.session = session
    const pending = auth.logout()
    await auth.login('test@example.com', 'password')
    resolve()
    expect(await pending).toBe(false)
    expect(auth.isAuthenticated).toBe(true)
  })
  it('does not switch environments after a superseding login', async () => {
    let resolve!: () => void
    vi.mocked(portalApi.logout).mockReturnValue(
      new Promise((done) => {
        resolve = done
      }),
    )
    vi.mocked(portalApi.login).mockResolvedValue(session)
    const auth = useAuthStore()
    auth.session = session
    const pending = auth.changeEnvironment('prod')
    await auth.login('test@example.com', 'password')
    resolve()
    await expect(pending).rejects.toThrow()
    expect(auth.environment).toBe('qa')
    expect(auth.isAuthenticated).toBe(true)
  })
  it('does not let an old restore overwrite refreshed expiry or permissions', async () => {
    let resolve!: (value: DashboardSession) => void;
    vi.mocked(portalApi.session).mockReturnValueOnce(new Promise((done) => { resolve = done; }));
    const auth = useAuthStore(); auth.session = session;
    const pending = auth.restoreSession();
    const fresh = { ...session, expiresAtUtc: '2026-11-17T13:00:00Z', canManageActivation: false };
    vi.mocked(portalApi.refresh).mockResolvedValueOnce(fresh);
    await auth.refreshSession();
    resolve({ ...session, canManageActivation: true }); await pending;
    expect(auth.session).toEqual(fresh);
  });
  it('does not release a newer restore when an obsolete restore finishes', async () => {
    let resolveOld!: (value: DashboardSession) => void;
    let resolveNew!: (value: DashboardSession) => void;
    vi.mocked(portalApi.session).mockReturnValueOnce(new Promise((done) => { resolveOld = done; }))
      .mockReturnValueOnce(new Promise((done) => { resolveNew = done; }));
    const auth = useAuthStore();
    const old = auth.restoreSession(); auth.clearSession();
    const current = auth.restoreSession();
    resolveOld(session); await old;
    const repeated = auth.restoreSession();
    expect(portalApi.session).toHaveBeenCalledTimes(2);
    resolveNew(session); expect(await current).toBe(true); expect(await repeated).toBe(true);
  });
  it('does not release a newer refresh after an obsolete refresh finishes', async () => {
    let resolveOld!: (value: DashboardSession) => void;
    let resolveNew!: (value: DashboardSession) => void;
    vi.mocked(portalApi.refresh).mockReturnValueOnce(new Promise((done) => { resolveOld = done; }))
      .mockReturnValueOnce(new Promise((done) => { resolveNew = done; }));
    vi.mocked(portalApi.login).mockResolvedValueOnce(session);
    const auth = useAuthStore(); auth.session = session;
    const old = auth.refreshSession(); await auth.login('test@example.com', 'password');
    const current = auth.refreshSession(); resolveOld(session); await old;
    const repeated = auth.refreshSession();
    expect(portalApi.refresh).toHaveBeenCalledTimes(2);
    const fresh = { ...session, canManageActivation: false };
    resolveNew(fresh); await current; await repeated;
    expect(auth.session).toEqual(fresh);
  });
  it('waits for an active refresh instead of launching competing restore metadata', async () => {
    let resolve!: (value: DashboardSession) => void;
    vi.mocked(portalApi.refresh).mockReturnValueOnce(new Promise((done) => { resolve = done; }));
    const auth = useAuthStore(); auth.session = session;
    const refresh = auth.refreshSession(); const restore = auth.restoreSession();
    expect(portalApi.session).not.toHaveBeenCalled();
    resolve(session); await refresh; expect(await restore).toBe(true);
  });

})

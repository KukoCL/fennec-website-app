import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('portal BFF client', () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_PORTAL_API_BASE_URL', 'https://api.fennecsoft.cl');
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
  it('uses a credentialed cookie request and never receives or stores a bearer token', async () => {
    const { portalApi } = await import('../api');
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ user: { email: 'test@example.com' } }) });
    await portalApi.login('test@example.com', 'example-password');
    expect(fetchMock).toHaveBeenCalledWith('https://api.fennecsoft.cl/dashboard/session', expect.objectContaining({
      credentials: 'include', redirect: 'error', method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'example-password' }),
    }));
    expect(fetchMock.mock.calls[0]?.[1].headers).not.toHaveProperty('Authorization');
  });
  it('encodes device IDs and cursors rather than interpolating query parameters', async () => {
    const { portalApi } = await import('../api');
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });
    await portalApi.dailyUsage('device/?&other=bad');
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      'https://api.fennecsoft.cl/dashboard/telemetry/daily-usage?deviceId=device%2F%3F%26other%3Dbad',
    );
    await portalApi.devices('cursor+/?');
    expect(fetchMock.mock.calls[1]?.[0]).toContain('cursor=cursor%2B%2F%3F');
  });
  it('requires the in-memory CSRF nonce for logout and refresh', async () => {
    const { portalApi } = await import('../api');
    fetchMock.mockResolvedValue({ ok: true, status: 204 });
    await portalApi.logout('nonce');
    expect(fetchMock.mock.calls[0]?.[1]).toEqual(expect.objectContaining({
      method: 'POST', headers: { 'X-Dashboard-CSRF': 'nonce' },
    }));
  });
  it('distinguishes wrong credentials, expired sessions, forbidden access and outages', async () => {
    const { portalApi } = await import('../api');
    fetchMock.mockResolvedValue({ ok: false, status: 401 });
    await expect(portalApi.login('test@example.com', 'invalid')).rejects.toMatchObject({ code: 'invalidCredentials' });
    await expect(portalApi.session()).rejects.toMatchObject({ code: 'sessionExpired' });
    fetchMock.mockResolvedValue({ ok: false, status: 403 });
    await expect(portalApi.session()).rejects.toMatchObject({ code: 'forbidden' });
    fetchMock.mockResolvedValue({ ok: false, status: 503 });
    await expect(portalApi.dailyUsage('device')).rejects.toMatchObject({ code: 'unavailable' });
  });
  it('fails closed without a configured BFF instead of simulating login or data', async () => {
    vi.stubEnv('VITE_PORTAL_API_BASE_URL', '');
    const { portalApi } = await import('../api');
    await expect(portalApi.session()).rejects.toMatchObject({ code: 'configuration' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('times out stalled requests and cancels abandoned component queries', async () => {
    const { portalApi } = await import('../api');
    vi.useFakeTimers();
    try {
      fetchMock.mockImplementation((_url, options) => new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      }));
      const pending = portalApi.session().catch((error: unknown) => error);
      await vi.advanceTimersByTimeAsync(20_000);
      expect(await pending).toMatchObject({ code: 'unavailable' });
      const controller = new AbortController();
      const abandoned = portalApi.dailyUsage('device', controller.signal).catch((error: unknown) => error);
      controller.abort();
      expect(await abandoned).toMatchObject({ name: 'AbortError' });
    } finally { vi.useRealTimers(); }
  });

  it('sends only an explicit single-device transition with CSRF and encodes the path', async () => {
    const { portalApi } = await import('../api');
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    await portalApi.setActivation('id/?', false, true, 'nonce');
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      'https://api.fennecsoft.cl/dashboard/telemetry/devices/id%2F%3F/activation',
    );
    expect(fetchMock.mock.calls[0]?.[1]).toEqual(expect.objectContaining({
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-Dashboard-CSRF': 'nonce' },
      body: JSON.stringify({ active: false, expectedActive: true }),
    }));
  });
  it('does not retry writes and distinguishes conflicts and ambiguous outcomes', async () => {
    const { portalApi } = await import('../api');
    fetchMock.mockResolvedValueOnce({ ok: false, status: 409, json: async () => ({}) });
    await expect(portalApi.setActivation('id', false, true, 'nonce'))
      .rejects.toMatchObject({ code: 'activationConflict' });
    fetchMock.mockResolvedValueOnce({ ok: false, status: 503,
      json: async () => ({ code: 'activation_outcome_unknown' }) });
    await expect(portalApi.setActivation('id', false, true, 'nonce'))
      .rejects.toMatchObject({ code: 'activationUnknown' });
    fetchMock.mockRejectedValueOnce(new TypeError('Network failed'));
    await expect(portalApi.setActivation('id', false, true, 'nonce'))
      .rejects.toMatchObject({ code: 'activationUnknown' });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

});

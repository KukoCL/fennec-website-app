import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import Dashboard from '../TelemetryDashboardView.vue';
import DeviceActivationControl from '@/features/portal/DeviceActivationControl.vue';
import { useAuthStore } from '@/stores/authStore';
import { portalApi, PortalError } from '@/features/portal/api';
vi.mock('@/features/portal/api', async (original) => ({
  ...await original<typeof import('@/features/portal/api')>(),
  portalApi: { devices: vi.fn(), dailyUsage: vi.fn(), setActivation: vi.fn() },
}));
const device = { deviceId: 'test-device', active: true, locationEnabled: false };
const usage = { deviceId: 'test-device', date: '2026-11-17', totalDurationSeconds: 4500, first: null, last: null };
let wrapper: VueWrapper | undefined;
async function mountDashboard(operator = false) {
  const router = createRouter({ history: createMemoryHistory(), routes: [
    { path: '/dashboard', component: { template: '<div />' } },
    { path: '/', component: Dashboard }, { path: '/login', name: 'login', component: { template: '<div />' } },
  ] });
  await router.push('/'); await router.isReady();
  const pinia = createPinia();
  if (operator) useAuthStore(pinia).session = {
    user: { id: 'fixture', email: 'fixture@example.test', roles: [] }, environment: 'qa', csrfToken: 'fixture-csrf',
    expiresAtUtc: '2026-12-01T00:00:00Z', canManageActivation: true,
  };
  wrapper = mount(Dashboard, { global: { plugins: [pinia, router] } });
  await flushPromises();
  return { wrapper, router };
}
describe('Jumbo dashboard', () => {
  beforeEach(() => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-17T10:00:00Z'));
    vi.resetAllMocks();
    vi.mocked(portalApi.devices).mockResolvedValue({ devices: [device], nextCursor: null,
      historicalInventoryVerified: false });
    vi.mocked(portalApi.dailyUsage).mockResolvedValue([usage]);
  });
  afterEach(() => { wrapper?.unmount(); wrapper = undefined; vi.useRealTimers(); });
  it('paginates the whole inventory but queries only the selected device', async () => {
    vi.mocked(portalApi.devices).mockResolvedValueOnce({ devices: [device], nextCursor: 'next',
      historicalInventoryVerified: false }).mockResolvedValueOnce({
      devices: [{ ...device, deviceId: 'second-device' }], nextCursor: null, historicalInventoryVerified: false,
    });
    const { wrapper } = await mountDashboard();
    expect(portalApi.devices).toHaveBeenCalledTimes(2);
    expect(wrapper.findAll('#telemetry-device option')).toHaveLength(2);
    expect(portalApi.dailyUsage).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('inventario histórico aún no está verificado');
    expect(wrapper.text()).toContain('1 h 15 min');
    expect(wrapper.text()).toContain('2026-11-17');
    expect(wrapper.text()).not.toContain('Online');
  });
  it('does not turn missing records into a confirmed zero', async () => {
    vi.mocked(portalApi.dailyUsage).mockResolvedValue([]);
    const { wrapper } = await mountDashboard();
    expect(wrapper.text()).toContain('Sin registros en este período');
    expect(wrapper.text()).toContain('no confirma uso cero');
    expect(wrapper.text()).not.toContain('0 h 00 min');
  });
  it('surfaces outages and retry rather than an empty result', async () => {
    vi.mocked(portalApi.dailyUsage).mockRejectedValueOnce(new PortalError('unavailable', 503));
    const { wrapper } = await mountDashboard();
    expect(wrapper.find('[role="alert"]').text()).toContain('No se pudo conectar');
    expect(wrapper.text()).not.toContain('Sin registros');
    await wrapper.find('[role="alert"] button').trigger('click'); await flushPromises();
    expect(wrapper.text()).toContain('1 h 15 min');
  });
  it('rejects a reversed custom range and reuses cached history for valid date filters', async () => {
    const { wrapper } = await mountDashboard();
    await wrapper.find('#telemetry-from').setValue('2026-11-18');
    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('[role="alert"]').text()).toContain('fecha inicial');
    expect(portalApi.dailyUsage).toHaveBeenCalledTimes(1);
    await wrapper.find('#telemetry-from').setValue('2026-11-17');
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    expect(portalApi.dailyUsage).toHaveBeenCalledTimes(1);
  });
  it('redirects expired sessions to login', async () => {
    vi.mocked(portalApi.dailyUsage).mockRejectedValueOnce(new PortalError('sessionExpired', 401));
    const { router } = await mountDashboard();
    expect(router.currentRoute.value.name).toBe('login');
    expect(router.currentRoute.value.query.reason).toBe('sessionExpired');
  });
  it('fails explicitly if inventory pagination repeats a cursor', async () => {
    vi.mocked(portalApi.devices).mockResolvedValue({ devices: [device], nextCursor: 'repeated',
      historicalInventoryVerified: false });
    const { wrapper } = await mountDashboard();
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(portalApi.dailyUsage).not.toHaveBeenCalled();
  });
  it('preserves uncertain activation across history-query remounts until inventory is reread', async () => {
    if (!HTMLDialogElement.prototype.showModal) HTMLDialogElement.prototype.showModal = function () {} ;
    if (!HTMLDialogElement.prototype.close) HTMLDialogElement.prototype.close = function () {} ;
    const show = vi.spyOn(HTMLDialogElement.prototype, 'showModal')
      .mockImplementation(function (this: HTMLDialogElement) {
        this.setAttribute('open', '');
      });
    const close = vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    });
    try {
      vi.mocked(portalApi.setActivation).mockRejectedValueOnce(new PortalError('activationUnknown', 503));
      const { wrapper } = await mountDashboard(true);
      await wrapper.find('[data-test="activation-open"]').trigger('click');
      await wrapper.find('[data-test="activation-confirm"]').trigger('click'); await flushPromises();
      expect(wrapper.find('[data-test="activation-open"]').attributes('disabled')).toBeDefined();
      await vi.advanceTimersByTimeAsync(61_000);
      let resolve!: (value: typeof usage[]) => void;
      vi.mocked(portalApi.dailyUsage).mockReturnValueOnce(new Promise((done) => { resolve = done; }));
      await wrapper.find('form').trigger('submit');
      expect(wrapper.findComponent(DeviceActivationControl).exists()).toBe(false);
      resolve([usage]); await flushPromises();
      expect(wrapper.find('[data-test="activation-open"]').attributes('disabled')).toBeDefined();
      await wrapper.findComponent(DeviceActivationControl).find('button').trigger('click'); await flushPromises();
      expect(portalApi.devices).toHaveBeenCalledTimes(2);
      expect(wrapper.find('[data-test="activation-open"]').attributes('disabled')).toBeUndefined();
      expect(portalApi.setActivation).toHaveBeenCalledTimes(1);
    } finally { show.mockRestore(); close.mockRestore(); }
  });

});

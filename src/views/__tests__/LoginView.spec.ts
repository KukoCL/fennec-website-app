import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import Login from '../LoginView.vue';
import { portalApi, PortalError, type DashboardSession } from '@/features/portal/api';
vi.mock('@/features/portal/api', async (original) => ({
  ...await original<typeof import('@/features/portal/api')>(),
  portalApi: { login: vi.fn() },
}));
const session: DashboardSession = {
  user: { id: 'test', email: 'test@example.com', roles: ['telemetry'] },
  environment: 'qa', csrfToken: 'example-nonce', expiresAtUtc: '2026-11-17T12:00:00Z',
};
async function setup() {
  const router = createRouter({ history: createMemoryHistory(), routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/dashboard', name: 'dashboard', component: { template: '<div />' } },
  ] });
  await router.push('/'); await router.isReady();
  const wrapper = mount(Login, { global: { plugins: [createPinia(), router] } });
  await wrapper.find('#login-email').setValue('test@example.com');
  await wrapper.find('#login-password').setValue('example-password');
  return { router, wrapper };
}
describe('private login', () => {
  beforeEach(() => { vi.resetAllMocks(); });
  it('clears the password after rejected credentials and permits retry', async () => {
    vi.mocked(portalApi.login).mockRejectedValueOnce(new PortalError('invalidCredentials'));
    const { wrapper, router } = await setup();
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(wrapper.find('[role="alert"]').text()).toContain('Correo o contraseña incorrectos');
    expect((wrapper.find('#login-password').element as HTMLInputElement).value).toBe('');
    vi.mocked(portalApi.login).mockResolvedValueOnce(session);
    await wrapper.find('#login-password').setValue('retry-password');
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(router.currentRoute.value.name).toBe('dashboard');
    wrapper.unmount();
  });
  it('blocks duplicate submissions and does not redirect after leaving the form', async () => {
    let resolve!: (value: DashboardSession) => void;
    vi.mocked(portalApi.login).mockReturnValue(new Promise((done) => { resolve = done; }));
    const { wrapper, router } = await setup();
    await wrapper.find('form').trigger('submit'); await wrapper.find('form').trigger('submit');
    expect(portalApi.login).toHaveBeenCalledTimes(1);
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
    wrapper.unmount(); resolve(session); await flushPromises();
    expect(router.currentRoute.value.path).toBe('/');
  });
  it('supports password visibility without changing the password', async () => {
    const { wrapper } = await setup();
    const toggle = wrapper.find('.portal-password-toggle');
    await toggle.trigger('click');
    expect(wrapper.find('#login-password').attributes('type')).toBe('text');
    expect(toggle.attributes('aria-pressed')).toBe('true');
    await toggle.trigger('click');
    expect(wrapper.find('#login-password').attributes('type')).toBe('password');
    wrapper.unmount();
  });
  it('explains a role-denied redirect instead of silently showing normal login', async () => {
    const { wrapper, router } = await setup();
    await router.replace('/?reason=forbidden'); await flushPromises();
    expect(wrapper.find('[role="alert"]').text()).toContain('no tiene acceso');
    wrapper.unmount();
  });

});

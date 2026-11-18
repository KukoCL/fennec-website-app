import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import Selector from '../EnvironmentSelector.vue'
import { useAuthStore } from '@/stores/authStore'
import { portalApi, PortalError, type DashboardSession } from '../api'
vi.mock('../api', async (original) => ({
  ...(await original<typeof import('../api')>()),
  portalApi: { logout: vi.fn() },
}))
const session: DashboardSession = {
  user: { id: 'test', email: 'test@example.test', roles: [] },
  environment: 'qa',
  csrfToken: 'nonce',
  expiresAtUtc: '2026-12-01T00:00:00Z',
}
async function setup(signedIn = true) {
  const pinia = createPinia()
  const auth = useAuthStore(pinia)
  if (signedIn) auth.session = session
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/login', name: 'login', component: { template: '<div />' } },
    ],
  })
  await router.push('/')
  await router.isReady()
  const wrapper = mount(Selector, { props: { returnToLogin: true }, global: { plugins: [pinia, router] } })
  return { wrapper, auth, router }
}
describe('one-site environment selector', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(portalApi.logout).mockResolvedValue()
  })
  it('starts in QA and revokes QA before switching to Prod and requiring sign-in', async () => {
    const { wrapper, auth, router } = await setup()
    expect(wrapper.find('select').element.value).toBe('qa')
    await wrapper.find('select').setValue('prod')
    await flushPromises()
    expect(portalApi.logout).toHaveBeenCalledWith('nonce', 'qa')
    expect(auth.environment).toBe('prod')
    expect(auth.session).toBeNull()
    expect(router.currentRoute.value.name).toBe('login')
    expect(wrapper.text()).toContain('dispositivos reales de Prod')
    wrapper.unmount()
  })
  it('keeps the old environment on failed revocation, without showing Prod data', async () => {
    vi.mocked(portalApi.logout).mockRejectedValueOnce(new PortalError('unavailable'))
    const { wrapper, auth, router } = await setup()
    await wrapper.find('select').setValue('prod')
    await flushPromises()
    expect(auth.environment).toBe('qa')
    expect(auth.session).not.toBeNull()
    expect(wrapper.find('select').element.value).toBe('qa')
    expect(router.currentRoute.value.path).toBe('/')
    expect(wrapper.find('[role="alert"]').text()).toContain('No se pudo conectar')
    wrapper.unmount()
  })
  it('blocks repeated changes during sign-out and honors disabled activation state', async () => {
    let resolve!: () => void
    vi.mocked(portalApi.logout).mockReturnValue(
      new Promise((done) => {
        resolve = done
      }),
    )
    const { wrapper, auth } = await setup()
    await wrapper.find('select').setValue('prod')
    await wrapper.find('select').setValue('prod')
    expect(portalApi.logout).toHaveBeenCalledTimes(1)
    expect(auth.environment).toBe('qa')
    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
    resolve()
    await flushPromises()
    await wrapper.setProps({ disabled: true })
    await wrapper.find('select').setValue('qa')
    await flushPromises()
    expect(auth.environment).toBe('prod')
    wrapper.unmount()
  })
  it('can choose before login without sending anything to an old BFF', async () => {
    const { wrapper, auth } = await setup(false)
    await wrapper.find('select').setValue('prod')
    await flushPromises()
    expect(auth.environment).toBe('prod')
    expect(portalApi.logout).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})

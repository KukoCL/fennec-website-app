import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import Selector from '../EnvironmentSelector.vue'
import { useAuthStore } from '@/stores/authStore'
import { portalApi, type DashboardSession } from '../api'
vi.mock('../api', async (original) => ({
  ...(await original<typeof import('../api')>()),
  portalApi: { logout: vi.fn(), login: vi.fn() },
}))
const session: DashboardSession = {
  user: { id: 'test', email: 'test@example.test' },
  csrfToken: 'nonce',
  expiresAtUtc: '2026-12-01T00:00:00Z',
}
function setup(signedIn = true) {
  const pinia = createPinia()
  const auth = useAuthStore(pinia)
  if (signedIn) auth.session = session
  const wrapper = mount(Selector, { global: { plugins: [pinia] } })
  return { wrapper, auth }
}
describe('one-site environment selector', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    sessionStorage.clear()
  })
  it('starts in QA, switches both ways without login/logout and names real Prod devices', async () => {
    const { wrapper, auth } = setup()
    const before = auth.session
    expect(wrapper.find('select').element.value).toBe('qa')
    await wrapper.find('select').setValue('prod')
    await flushPromises()
    expect(auth.environment).toBe('prod')
    expect(auth.session).toBe(before)
    expect(wrapper.text()).toContain('dispositivos reales de Prod')
    await wrapper.find('select').setValue('qa')
    await flushPromises()
    expect(auth.environment).toBe('qa')
    expect(auth.session).toBe(before)
    expect(portalApi.logout).not.toHaveBeenCalled()
    expect(portalApi.login).not.toHaveBeenCalled()
    wrapper.unmount()
  })
  it('honors disabled and centrally pending activation state, then allows a switch', async () => {
    const { wrapper, auth } = setup()
    auth.beginActivation()
    await flushPromises()
    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
    await wrapper.find('select').setValue('prod')
    expect(auth.environment).toBe('qa')
    auth.finishActivation()
    await wrapper.setProps({ disabled: true })
    await wrapper.find('select').setValue('prod')
    expect(auth.environment).toBe('qa')
    await wrapper.setProps({ disabled: false })
    await wrapper.find('select').setValue('prod')
    await flushPromises()
    expect(auth.environment).toBe('prod')
    wrapper.unmount()
  })
  it('can choose before login without sending anything to the BFF', async () => {
    const { wrapper, auth } = setup(false)
    await wrapper.find('select').setValue('prod')
    await flushPromises()
    expect(auth.environment).toBe('prod')
    expect(portalApi.logout).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})

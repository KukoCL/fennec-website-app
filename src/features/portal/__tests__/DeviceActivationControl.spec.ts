import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import Control from '../DeviceActivationControl.vue'
import { portalApi, PortalError, type ActivationResult } from '../api'
import { useAuthStore } from '@/stores/authStore'
vi.mock('../api', async (original) => ({
  ...await original<typeof import('../api')>(), portalApi: { setActivation: vi.fn() },
}))
const device = { deviceId: 'synthetic-device', active: true, locationEnabled: false }
const result: ActivationResult = {
  deviceId: device.deviceId, active: false, previousActive: true, auditId: 'test-audit',
}
const originalShow = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true, value(this: HTMLDialogElement) { this.setAttribute('open', '') },
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true, value(this: HTMLDialogElement) { this.removeAttribute('open') },
  })
})
afterAll(() => {
  if (originalShow) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShow)
  else delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).close
})
async function setup(canManage = true) {
  const pinia = createPinia(); setActivePinia(pinia)
  const auth = useAuthStore()
  auth.session = { user: { id: 'fixture', email: 'fixture@example.test', roles: [] }, csrfToken: 'fixture-csrf',
    expiresAtUtc: '2026-12-01T00:00:00Z', canManageActivation: canManage }
  const router = createRouter({ history: createMemoryHistory(), routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/login', name: 'login', component: { template: '<div />' } },
  ] })
  await router.push('/'); await router.isReady()
  const refreshInventory = vi.fn().mockResolvedValue(undefined)
  const updateDevice = vi.fn()
  const wrapper = mount(Control, { props: { device: { ...device }, refreshInventory, updateDevice },
    global: { plugins: [pinia, router] } })
  return { wrapper, auth, router, refreshInventory, updateDevice }
}
const open = async (wrapper: VueWrapper) => wrapper.find('[data-test="activation-open"]').trigger('click')
describe('device activation confirmation', () => {
  beforeEach(() => { vi.resetAllMocks(); vi.mocked(portalApi.setActivation).mockResolvedValue(result) })
  it('does not offer a mutation to read-only users', async () => {
    const { wrapper } = await setup(false)
    expect(wrapper.find('[data-test="activation-open"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('acceso de lectura')
    expect(portalApi.setActivation).not.toHaveBeenCalled(); wrapper.unmount()
  })
  it('requires a separate confirmation with the exact ID and transition', async () => {
    const { wrapper, updateDevice } = await setup()
    await open(wrapper)
    expect(portalApi.setActivation).not.toHaveBeenCalled()
    expect(wrapper.find('dialog').attributes('open')).toBeDefined()
    expect(wrapper.find('dialog').text()).toContain(device.deviceId)
    expect(wrapper.find('dialog').text()).toContain('no recibir el cambio de inmediato')
    await wrapper.find('[data-test="activation-confirm"]').trigger('click'); await flushPromises()
    expect(portalApi.setActivation).toHaveBeenCalledWith(device.deviceId, false, true, 'fixture-csrf')
    expect(updateDevice).toHaveBeenCalledWith(result)
    expect(wrapper.text()).toContain('test-audit'); wrapper.unmount()
  })
  it('cancels before submission and rejects a state changed while confirmation was open', async () => {
    const { wrapper } = await setup()
    await open(wrapper)
    await wrapper.findAll('dialog button')[0]!.trigger('click')
    expect(portalApi.setActivation).not.toHaveBeenCalled()
    await open(wrapper)
    await wrapper.setProps({ device: { ...device, active: false } })
    await wrapper.find('[data-test="activation-confirm"]').trigger('click')
    expect(portalApi.setActivation).not.toHaveBeenCalled()
    expect(wrapper.find('[role="alert"]').text()).toContain('estado cambió')
    wrapper.unmount()
  })
  it('blocks repeated submission while a confirmed change is pending', async () => {
    let resolve!: (value: ActivationResult) => void
    vi.mocked(portalApi.setActivation).mockReturnValue(new Promise((done) => { resolve = done }))
    const { wrapper } = await setup(); await open(wrapper)
    await wrapper.find('[data-test="activation-confirm"]').trigger('click')
    await wrapper.find('[data-test="activation-confirm"]').trigger('click')
    expect(portalApi.setActivation).toHaveBeenCalledTimes(1)
    expect(wrapper.find('[data-test="activation-confirm"]').attributes('disabled')).toBeDefined()
    await wrapper.find('dialog').trigger('cancel')
    expect(wrapper.find('dialog').attributes('open')).toBeDefined()
    resolve(result); await flushPromises(); wrapper.unmount()
  })
  it('does not retry or claim failure/success after an ambiguous outcome', async () => {
    vi.mocked(portalApi.setActivation).mockRejectedValueOnce(new PortalError('activationUnknown', 503))
    const { wrapper, refreshInventory, updateDevice } = await setup(); await open(wrapper)
    await wrapper.find('[data-test="activation-confirm"]').trigger('click'); await flushPromises()
    expect(portalApi.setActivation).toHaveBeenCalledTimes(1)
    expect(updateDevice).not.toHaveBeenCalled()
    expect(wrapper.find('[role="alert"]').text()).toContain('puede haberse aplicado')
    expect(wrapper.find('[data-test="activation-open"]').attributes('disabled')).toBeDefined()
    await wrapper.findAll('section > div button')[0]!.trigger('click'); await flushPromises()
    expect(refreshInventory).toHaveBeenCalledOnce()
    expect(wrapper.find('[data-test="activation-open"]').attributes('disabled')).toBeUndefined()
    wrapper.unmount()
  })
  it('clears expired sessions rather than retrying the mutation', async () => {
    vi.mocked(portalApi.setActivation).mockRejectedValueOnce(new PortalError('sessionExpired', 401))
    const { wrapper, router, auth } = await setup(); await open(wrapper)
    await wrapper.find('[data-test="activation-confirm"]').trigger('click'); await flushPromises()
    expect(router.currentRoute.value.name).toBe('login'); expect(auth.isAuthenticated).toBe(false)
    expect(portalApi.setActivation).toHaveBeenCalledTimes(1); wrapper.unmount()
  })
})

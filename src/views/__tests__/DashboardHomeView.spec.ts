import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import Home from '../DashboardHomeView.vue'
import { simulatorCatalog } from '@/features/portal/simulators'
describe('simulator navigation', () => {
  it('offers only the configured Jumbo view and discloses the missing backend scope', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [
      { path: '/', component: Home },
      { path: '/dashboard/jumbo', name: 'jumbo-telemetry', component: { template: '<div />' } },
    ] })
    await router.push('/'); await router.isReady()
    const wrapper = mount(Home, { global: { plugins: [createPinia(), router] } })
    expect(simulatorCatalog).toHaveLength(1)
    expect(wrapper.findAll('article')).toHaveLength(1)
    expect(wrapper.find('article').text()).toContain('Jumbo')
    expect(wrapper.find('article a').attributes('href')).toBe('/dashboard/jumbo')
    expect(wrapper.text()).toContain('no informa IDs de simulador')
    expect(wrapper.find('article a').attributes('href')).not.toContain('simulatorId')
    wrapper.unmount()
  })
})

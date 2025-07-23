import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Navbar from '../NavbarComponent.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Create a mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
    { path: '/about', name: 'About', component: { template: '<div>About</div>' } },
    { path: '/services', name: 'Services', component: { template: '<div>Services</div>' } },
    { path: '/portfolio', name: 'Portfolio', component: { template: '<div>Portfolio</div>' } },
    { path: '/contact', name: 'Contact', component: { template: '<div>Contact</div>' } }
  ]
})

describe('Navbar', () => {
  const wrapper = mount(Navbar, {
    global: {
      plugins: [router, createTestingPinia({ createSpy: vi.fn })]
    }
  })

  it('renders properly', () => {

    // Verify the navbar brand is present
    expect(wrapper.find('.navbar-brand').exists()).toBe(true)
    expect(wrapper.find('.navbar-brand img').exists()).toBe(true)
    expect(wrapper.text()).toContain('Fennec')
  })

  it('toggles navigation on button click', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router, createTestingPinia({ createSpy: vi.fn })]
      }
    })

    // Initially the nav should be collapsed
    expect(wrapper.find('.collapse.show').exists()).toBe(false)

    // Click the toggle button
    await wrapper.find('.navbar-toggler').trigger('click')

    // Nav should be expanded
    expect(wrapper.find('.collapse.show').exists()).toBe(true)

    // Click again to collapse
    await wrapper.find('.navbar-toggler').trigger('click')

    // Nav should be collapsed again
    expect(wrapper.find('.collapse.show').exists()).toBe(false)
  })

  it('contains all navigation links', () => {
    const expectedLinks = ['Inicio', 'Acerca de', 'Servicios', 'Portafolio', 'Contacto']

    expectedLinks.forEach(linkText => {
      expect(wrapper.text()).toContain(linkText)
    })
  })

  it('contains language dropdown', () => {
    // Verify language dropdown exists
    expect(wrapper.find('.dropdown-toggle').exists()).toBe(true)
    expect(wrapper.text()).toContain('Español') // Default language is Spanish
  })
});

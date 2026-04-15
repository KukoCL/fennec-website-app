import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Navbar from '../NavbarComponent.vue';
import { createRouter, createWebHistory } from 'vue-router';

const createTestRouter = () =>
  createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'Home',
        component: { template: '<div>Home</div>' },
        alias: ['/full'],
      },
      {
        path: '/about',
        name: 'About',
        component: { template: '<div>About</div>' },
        alias: ['/full/about'],
      },
      {
        path: '/services',
        name: 'Services',
        component: { template: '<div>Services</div>' },
        alias: ['/full/services'],
      },
      {
        path: '/portfolio',
        name: 'Portfolio',
        component: { template: '<div>Portfolio</div>' },
        alias: ['/full/portfolio'],
      },
      {
        path: '/contact',
        name: 'Contact',
        component: { template: '<div>Contact</div>' },
        alias: ['/full/contact'],
      },
    ],
  });

describe('Navbar', () => {
  let router: ReturnType<typeof createTestRouter>;

  beforeEach(() => {
    router = createTestRouter();
  });

  const mountNavbar = () =>
    mount(Navbar, {
      global: {
        plugins: [router, createTestingPinia({ createSpy: vi.fn })],
      },
    });

  it('renders properly', () => {
    const wrapper = mountNavbar();

    // Verify the navbar brand is present
    expect(wrapper.find('.navbar-brand').exists()).toBe(true);
    expect(wrapper.find('.navbar-brand img').exists()).toBe(true);
    expect(wrapper.text()).toContain('Fennec');
  });

  it('toggles navigation on button click', async () => {
    const wrapper = mountNavbar();

    // Initially the nav should be collapsed
    expect(wrapper.find('.collapse.show').exists()).toBe(false);

    // Click the toggle button
    await wrapper.find('.navbar-toggler').trigger('click');

    // Nav should be expanded
    expect(wrapper.find('.collapse.show').exists()).toBe(true);

    // Click again to collapse
    await wrapper.find('.navbar-toggler').trigger('click');

    // Nav should be collapsed again
    expect(wrapper.find('.collapse.show').exists()).toBe(false);
  });

  it('contains all navigation links', () => {
    const wrapper = mountNavbar();
    const expectedLinks = ['Inicio', 'Acerca de', 'Servicios', 'Portafolio', 'Contacto'];

    expectedLinks.forEach((linkText) => {
      expect(wrapper.text()).toContain(linkText);
    });
  });

  it('contains language dropdown', () => {
    const wrapper = mountNavbar();
    // Verify language dropdown exists
    expect(wrapper.find('.dropdown-toggle').exists()).toBe(true);
    expect(wrapper.text()).toContain('Español'); // Default language is Spanish
  });

  it('keeps /full prefix in menu links when current route is in full mode', async () => {
    await router.push('/full/about');
    await router.isReady();
    const wrapper = mountNavbar();

    const servicesLink = wrapper.findAll('a.nav-link').find((link) => link.text() === 'Servicios');

    expect(servicesLink?.attributes('href')).toBe('/full/services');
  });
});

import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/authStore'
import { PortalError } from '@/features/portal/api'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardHomeView.vue'),
      meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    {
      path: '/dashboard/jumbo',
      name: 'jumbo-telemetry',
      component: () => import('../views/TelemetryDashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      alias: ['/full'],
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      alias: ['/full/about'],
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/ServicesView.vue'),
      alias: ['/full/services'],
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: () => import('../views/PortfolioView.vue'),
      alias: ['/full/portfolio'],
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      alias: ['/full/contact'],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true
  const auth = useAuthStore()
  try {
    if (await auth.restoreSession()) return true
    return { name: 'login' }
  } catch (error) {
    return { name: 'login', query: { reason: error instanceof PortalError ? error.code : 'unavailable' } }
  }
})

export default router

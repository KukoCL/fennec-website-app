import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      alias: ['/lite'],
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      alias: ['/lite/about'],
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/ServicesView.vue'),
      alias: ['/lite/services'],
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: () => import('../views/PortfolioView.vue'),
      alias: ['/lite/portfolio'],
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      alias: ['/lite/contact'],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from) => {
  const isLitePath = (path: string) => path === '/lite' || path.startsWith('/lite/');
  const fromLitePath = isLitePath(from.path);
  const toLitePath = isLitePath(to.path);

  if (fromLitePath && !toLitePath) {
    const normalizedPath = to.path.startsWith('/') ? to.path : `/${to.path}`;
    const litePath = normalizedPath === '/' ? '/lite' : `/lite${normalizedPath}`;

    return {
      path: litePath,
      query: to.query,
      hash: to.hash,
    };
  }

  return true;
});

export default router;

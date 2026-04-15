import { createRouter, createWebHashHistory } from 'vue-router';
import { isFullPath } from '@/infrastructure/utils/isFullPath';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
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
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from) => {
  const fromFullPath = isFullPath(from.path);
  const toFullPath = isFullPath(to.path);

  if (fromFullPath && !toFullPath) {
    const fullPath = to.path === '/' ? '/full' : `/full${to.path}`;
    const resolvedFullPath = router.resolve(fullPath);

    if (resolvedFullPath.matched.length === 0) {
      return true;
    }

    return {
      path: fullPath,
      query: to.query,
      hash: to.hash,
    };
  }

  return true;
});

export default router;

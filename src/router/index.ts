import { createRouter, createWebHashHistory } from 'vue-router';
import { isLitePath } from '@/infrastructure/utils/isLitePath';
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
  const fromLitePath = isLitePath(from.path);
  const toLitePath = isLitePath(to.path);

  if (fromLitePath && !toLitePath) {
    const litePath = to.path === '/' ? '/lite' : `/lite${to.path}`;
    const resolvedLitePath = router.resolve(litePath);

    if (resolvedLitePath.matched.length === 0) {
      return true;
    }

    return {
      path: litePath,
      query: to.query,
      hash: to.hash,
    };
  }

  return true;
});

export default router;

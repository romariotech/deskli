import { createRouter, createWebHistory } from 'vue-router'
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: () => import('@/pages/LoginPage.vue') },
    { path: '/home', name: 'home', component: () => import('@/pages/HomePage.vue') },
    {
      path: '/design-system',
      name: 'design-system',
      component: () => import('@/pages/design-system/DesignSystemPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
  scrollBehavior(to, from, saved) {
    return saved || (to.hash ? { el: to.hash, top: 24 } : undefined) || (to.path === from.path ? undefined : { top: 0 })
  },
})

import { createRouter, createWebHistory } from 'vue-router'
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', meta: { title: 'Entrar' }, component: () => import('@/pages/LoginPage.vue') },
    { path: '/home', name: 'home', meta: { title: 'Início' }, component: () => import('@/pages/HomePage.vue') },
    {
      path: '/design-system',
      name: 'design-system',
      meta: { title: 'Design system' },
      component: () => import('@/pages/design-system/DesignSystemPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      meta: { title: 'Página não encontrada' },
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
  scrollBehavior(to, from, saved) {
    return saved || (to.hash ? { el: to.hash, top: 24 } : undefined) || (to.path === from.path ? undefined : { top: 0 })
  },
})
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · deskli` : 'deskli'
})

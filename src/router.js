import { createRouter, createWebHistory } from 'vue-router'

import CompareView from '@/views/CompareView.vue'

const routes = [
  {
    path: '/',
    name: 'compare',
    component: CompareView,
  },
  {
    path: '/saved',
    name: 'saved',
    component: () => import('@/views/SavedView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

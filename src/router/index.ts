import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: '首页',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/example',
    name: '示例',
    component: () => import('@/views/Exam.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

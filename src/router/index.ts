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
  {
    path: '/evaluations',
    name: '评教任务管理',
    component: () => import('@/views/Evaluations.vue'),
    children: [
      {
        path: 'add',
        name: '添加评教任务',
        component: () => import('@/views/AddEvaluation.vue'),
      },
      {
        path: 'edit/:id',
        name: '编辑评教任务',
        component: () => import('@/views/EditEvaluation.vue'),
      }
    ],
  },
  {
    path: '/classes',
    name: '班级管理',
    component: () => import('@/views/Classes.vue'),
  },
  {
    path: '/teachers',
    name: '教师管理',
    component: () => import('@/views/Teachers.vue'),
  },
  {
    path: '/students',
    name: '学生管理',
    component: () => import('@/views/Students.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

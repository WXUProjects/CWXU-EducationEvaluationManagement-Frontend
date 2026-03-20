import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: '首页',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/evaluations',
    name: '评教任务管理',
    component: () => import('@/views/evaluation/Evaluations.vue'),
    children: [
      {
        path: 'add',
        name: '新建评教任务',
        component: () => import('@/views/evaluation/AddEvaluation.vue'),
      },
      {
        path: 'edit/:id',
        name: '编辑评教任务',
        component: () => import('@/views/evaluation/EditEvaluation.vue'),
      }
    ],
  },
  {
    path: '/teaching-classes',
    name: '教学班级管理',
    component: () => import('@/views/teaching-class/TeachingClasses.vue'),
    children: [
      {
        path: 'students/:id',
        name: '管理教学班级学生',
        component: () => import('@/views/teaching-class/EditClassStudents.vue'),
      }
    ],
  },
  {
    path: '/administrative-classes',
    name: '行政班级管理',
    component: () => import('@/views/administrative-class/AdministrativeClasses.vue'),
    children: [
      {
        path: 'students/:id',
        name: '管理教学班级学生',
        component: () => import('@/views/administrative-class/EditClassStudents.vue'),
      }
    ],
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
  {
    path: '/:pathMatch(.*)*',
    name: '无效页面',
    component: () => import('@/views/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

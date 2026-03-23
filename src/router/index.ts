import { KeepAlive } from 'vue'
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
    component: () => import('@/components/layout.vue'),
    redirect: '/teaching-classes/home',
    children: [
      {
        path: 'home',
        name: '管理教学班级',
        component: () => import('@/views/teaching-class/TeachingClasses.vue'),
        meta: { KeepAlive: true }
      },
      {
        path: 'students/:id',
        name: '管理教学班级学生',
        component: () => import('@/views/teaching-class/EditClassStudents.vue'),
      }
    ],
  },
  {
    path: '/administrative-classes',
    component: () => import('@/components/layout.vue'),
    redirect: '/administrative-classes/home',
    children: [
      {
        path: 'home',
        name: '管理行政班级',
        component: () => import('@/views/administrative-class/AdministrativeClasses.vue'),
        meta: { KeepAlive: true }
      },
      {
        path: 'students/:id',
        name: '管理行政班级学生',
        component: () => import('@/views/administrative-class/EditClassStudents.vue'),
      }
    ],
  },
  {
    path: '/teachers',
    component: () => import('@/components/layout.vue'),
    redirect: '/teachers/home',
    children: [
      {
        path: 'home',
        name: '管理教师',
        component: () => import('@/views/teacher/Teachers.vue'),
        meta: { KeepAlive: true }
      },
      {
        path: 'classes/:id',
        name: '管理教师班级',
        component: () => import('@/views/teacher/Classes.vue'),
      }
    ],
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

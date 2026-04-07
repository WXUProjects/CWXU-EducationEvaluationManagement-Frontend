import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: '登录',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: '首页',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/evaluations',
    name: '评教任务管理',
    component: () => import('@/views/evaluation/Evaluations.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'add',
        name: '新建评教任务',
        component: () => import('@/views/evaluation/AddEvaluation.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'edit/:id',
        name: '编辑评教任务',
        component: () => import('@/views/evaluation/EditEvaluation.vue'),
        meta: { requiresAuth: true }
      }
    ],
  },
  {
    path: '/teaching-courses',
    component: () => import('@/components/layout.vue'),
    redirect: '/teaching-courses/home',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: '管理教学班级',
        component: () => import('@/views/teaching-course/TeachingCourses.vue'),
        meta: { KeepAlive: true, requiresAuth: true }
      },
      {
        path: 'students/:id',
        name: '管理教学班级学生',
        component: () => import('@/views/teaching-course/EditCourseStudents.vue'),
        meta: { requiresAuth: true }
      }
    ],
  },
  {
    path: '/teachers',
    component: () => import('@/components/layout.vue'),
    redirect: '/teachers/home',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: '管理教师',
        component: () => import('@/views/teacher/Teachers.vue'),
        meta: { KeepAlive: true, requiresAuth: true }
      },
      {
        path: 'courses/:id',
        name: '管理教师班级',
        component: () => import('@/views/teacher/Courses.vue'),
        meta: { requiresAuth: true }
      }
    ],
  },
  {
    path: '/students',
    name: '学生管理',
    component: () => import('@/views/Students.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: '无效页面',
    component: () => import('@/views/404.vue'),
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 监听认证过期事件
if (typeof window !== 'undefined') {
  window.addEventListener('auth-expired', () => {
    // 清除本地token
    localStorage.removeItem('token');
    // 重定向到登录页
    if (router.currentRoute.value.path !== '/') {
      router.push('/');
    }
  });
}

// 路由守卫
router.beforeEach(async (to, from) => {
  const userStore = useUserStore()

  // 检查路由是否需要认证
  const requiresAuth = to.meta.requiresAuth !== false // 默认为true，除非显式设置为false

  if (requiresAuth && !userStore.isAuthenticated) {
    // 需要认证但未登录，重定向到登录页
    return '/'
  } else if (!requiresAuth && userStore.isAuthenticated && to.path === '/') {
    // 已登录但访问登录页，重定向到首页
    return '/home'
  }
  // 其他情况放行
  // 返回 true 或 undefined 继续导航
})

export default router
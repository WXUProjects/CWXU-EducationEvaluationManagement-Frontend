import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/api'
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  "exp": number,
  "iat": number,
  "nbf": number,
  "role": string,
  "userId": number,
  "username": string
}


export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string | null>(localStorage.getItem('token'))

  // JWT荷载计算属性
  const payload = computed((): JwtPayload | null => {
    if (!token.value) return null
    try {
      return jwtDecode<JwtPayload>(token.value)
    } catch (error) {
      console.error('JWT解码失败:', error)
      return null
    }
  })

  // 用户信息计算属性
  const userId = computed(() => payload.value?.userId ?? null)
  const username = computed(() => payload.value?.username ?? null)
  const role = computed(() => payload.value?.role ?? null)

  // 检查token是否过期
  const isTokenExpired = computed(() => {
    if (!payload.value?.exp) return true
    // exp是Unix时间戳（秒），Date.now()返回毫秒
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.value.exp < currentTime
  })

  // 检查token是否有效（未过期）
  const isTokenValid = computed(() => {
    return !!token.value && !isTokenExpired.value
  })

  // 认证状态（token存在且未过期）
  const isAuthenticated = computed(() => isTokenValid.value)

  // 登录
  const login = async (username: string, password: string) => {
    try {
      const response = await api.auth.adminLogin({ username, password });
      if (response.message == '登录成功') {
        token.value = response.token;
        localStorage.setItem('token', token.value)
        return { success: true }
      } else {
        return { success: false, error: response.message }
      }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, error: '用户名或密码错误' }
    }
  }

  // 登出
  const logout = () => {
    token.value = null
    localStorage.removeItem('token')
  }

  // 检查登录状态（验证token是否有效）
  const checkAuth = async () => {
    if (!token.value) {
      return false
    }

    // 检查token是否有效（未过期）
    if (isTokenExpired.value) {
      // token已过期，自动登出
      logout()
      return false
    }

    return true
  }

  // 监听localStorage变化，同步token状态
  if (typeof window !== 'undefined') {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token') {
        // 同步token值
        token.value = event.newValue
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // 注意：storage事件只在同一站点的不同标签页之间触发
    // 对于当前标签页的修改，不会触发storage事件
    // 所以还需要监听自定义的auth-expired事件
    window.addEventListener('auth-expired', () => {
      token.value = null
    })
  }

  return {
    token,
    isAuthenticated,
    payload,
    userId,
    username,
    role,
    isTokenExpired,
    isTokenValid,
    login,
    logout,
    checkAuth,
  }
})
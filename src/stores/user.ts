import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export interface UserInfo {
  id: number
  username: string
  name: string
  role: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<UserInfo | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  // 从本地存储初始化用户信息
  const initFromStorage = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        user.value = null
      }
    }
  }

  // 初始化
  initFromStorage()

  // 登录
  const login = async (username: string, password: string) => {
    try {
      // 这里应该调用真实API，暂时模拟登录
      // const response = await axios.post('/api/auth/login', { username, password })
      // const { token: newToken, user: userData } = response.data

      // 模拟API响应
      const newToken = 'mock-jwt-token-' + Date.now()
      const userData: UserInfo = {
        id: 1,
        username,
        name: username === 'admin' ? '管理员' : '用户',
        role: username === 'admin' ? 'admin' : 'user'
      }

      // 更新状态
      token.value = newToken
      user.value = userData

      // 保存到本地存储
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))

      return { success: true, user: userData }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, error: '用户名或密码错误' }
    }
  }

  // 登出
  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 检查登录状态（验证token是否有效）
  const checkAuth = async () => {
    if (!token.value) {
      return false
    }
    // 这里可以添加token验证逻辑
    return true
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
})
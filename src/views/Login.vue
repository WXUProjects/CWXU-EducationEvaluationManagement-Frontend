<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)

const handleLogin = async () => {
  if (!form.value.username.trim() || !form.value.password.trim()) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  loading.value = true
  const result = await userStore.login(form.value.username, form.value.password)
  loading.value = false

  if (result.success) {
    ElMessage.success('登录成功')
    router.push('/home')
  } else {
    ElMessage.error(result.error || '登录失败')
  }
}

// 处理回车键登录
const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-section">
        <img
          src="/xiboliyaxueyuan.png"
          alt="Logo"
          class="logo"
        />
        <h1 class="title">教学评价管理系统</h1>
        <p class="subtitle">欢迎使用，请登录您的账户</p>
      </div>

      <el-form
        :model="form"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item>
          <el-input
            v-model="form.username"
            placeholder="用户名"
            size="large"
            prefix-icon="User"
            @keyup="handleKeyup"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            size="large"
            prefix-icon="Lock"
            show-password
            @keyup="handleKeyup"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogin"
            class="login-button"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="footer">
        <p class="hint">提示：可使用任意用户名和密码登录（演示模式）</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.logo-section {
  margin-bottom: 40px;
}

.logo {
  width: 100%;
  margin-bottom: 20px;
  object-fit: contain;
}

.title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.login-form {
  margin-bottom: 30px;
}

.login-button {
  width: 100%;
  background-color: #6f2b75;
  border-color: #6f2b75;
}

.login-button:hover {
  background-color: #5a225f;
  border-color: #5a225f;
}

.login-button:focus {
  background-color: #5a225f;
  border-color: #5a225f;
}

.footer {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.hint {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
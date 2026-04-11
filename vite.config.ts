import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    // 【新增这一行】强制让 Vite 打包出的所有静态资源前缀都带上 /admin/
    base: '/admin/', 
    
    plugins: [
      vue()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      // 指定端口 3000
      port: 3000,
      // 将 /api 请求代理到后端API服务器
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          // 不需要rewrite，因为API请求路径已包含 /api/v1 前缀
          // rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        }
      }
    }
  }
})

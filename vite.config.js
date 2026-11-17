import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        // 全局注入 Less 变量与媒体查询断点，所有组件内可直接使用
        additionalData: `@import "@/styles/variables.less";`
      }
    }
  },
  server: {
    host: '0.0.0.0', // 允许局域网手机访问，方便真机调试移动适配
    port: 5173,
    proxy: {
      // 前端 /api 请求代理到 Express 后端
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})

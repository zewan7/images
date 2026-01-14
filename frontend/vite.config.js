import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // 针对React 18优化配置，解决静态标志警告
      // 使用自动JSX运行时
      jsxRuntime: 'automatic',
      // 启用快速刷新
      fastRefresh: true
    })
  ],
  server: {
    port: 8300,
    proxy: {
      '/api': {
        target: 'http://localhost:8301',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 代码分割
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    },
    minify: 'esbuild', // 使用esbuild进行代码压缩，不需要额外安装terser
    sourcemap: false, // 生产环境不生成sourcemap
    chunkSizeWarningLimit: 1000, // 调整chunk大小警告阈值
  },
  // 配置CDN
  base: '/',
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
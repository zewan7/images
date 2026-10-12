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
      },
      '/images': {
        target: 'http://localhost:8301',
        changeOrigin: true
      }
    }
  },
  // 预览服务器（npm run preview，生产构建预览）：默认端口4173，这里与dev对齐为8300
  preview: {
    port: 8300,
    host: true,
    // 允许通过自定义域名/内网IP访问（不配置时Vite只认localhost）
    allowedHosts: ['app.eeffve.click']
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
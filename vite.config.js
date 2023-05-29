import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig((command) => {
  const env = loadEnv(command.mode, process.cwd())
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE || 'http://47.251.48.202',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src',
        'modals': '/src/modals',
        'components': '/src/components',
        'routes': '/src/routes',
      }
    }
  }
})

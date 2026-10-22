import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { API_PORT = '3000' } = loadEnv(mode, process.cwd(), '')
  const backend = `http://localhost:${API_PORT}`

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': backend,
        '/uploads': backend
      }
    }
  }
})

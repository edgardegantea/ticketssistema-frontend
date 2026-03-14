import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Carga .env según modo
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react()],
    base: '/',  // Root del dominio (tickets.maewalliscorp.org)
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 5173,
      open: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ACT/',
  server: {
    port: 5174,
    strictPort: true,   // fail clearly if port is already taken
    host: true,
  },
})

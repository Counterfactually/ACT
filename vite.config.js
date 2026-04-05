import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // /ACT/ base only needed for GitHub Pages production builds.
  // Dev server uses plain / so HMR and asset paths work normally.
  base: command === 'build' ? '/ACT/' : '/',
  server: {
    port: 5174,
    strictPort: true,
    host: true,
  },
}))

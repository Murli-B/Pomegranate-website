import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow the sandbox/preview host to reach the dev server
    allowedHosts: true,
  },
})

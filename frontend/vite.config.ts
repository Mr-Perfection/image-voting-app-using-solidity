import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      clientPort: 3001 // https://vitejs.dev/config/server-options.html#server-hmr
    }
  }
})

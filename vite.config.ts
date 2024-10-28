import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/photos': {
        target: 'https://api.unsplash.com', // The target API
        changeOrigin: true, // Bypass CORS by setting the origin
        rewrite: (path) => path.replace(/^\/api\/photos/, '/photos'),
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/v1": {
        target: "https://texttospeech.responsivevoice.org",
        changeOrigin: true,
        secure: true, // set to true nếu bạn sử dụng HTTPS
        rewrite: (path) => path.replace(/^\/v1/, ""),
      },
    },
  },
});


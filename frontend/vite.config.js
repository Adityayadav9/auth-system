import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://auth-system-pf8e.vercel.app', // Points to your backend PORT=3000
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
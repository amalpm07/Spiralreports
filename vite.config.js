import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://hibow.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  plugins: [
    react() // Include @vitejs/plugin-react-swc for React compilation with SWC
  ],
  optimizeDeps: {
    include: ['clsx'], // Ensure clsx is included in optimization
  },
});

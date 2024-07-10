import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://hibow.in/api',
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ['@emotion/is-prop-valid'], // Ensure @emotion/is-prop-valid is included in the optimization
  },
  plugins: [react()],
});

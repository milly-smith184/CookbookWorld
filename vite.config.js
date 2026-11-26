
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* Configures Vite for the CookbookWorld frontend. */
export default defineConfig({
  plugins: [react()],

  /* Forwards frontend API requests to the Express backend. */
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});
   
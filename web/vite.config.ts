import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    cssCodeSplit: false,
    // Two pages: the story (prerendered) and the Clinic Vitals checkup
    rollupOptions: { input: { main: resolve(__dirname, 'index.html'), vitals: resolve(__dirname, 'vitals.html') } },
  },
});

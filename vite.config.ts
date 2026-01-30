import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  },
  define: {
    // Forzamos la inyección para que esté disponible tanto en process.env como en variables globales de window
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'window.VITE_GEMINI_API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});
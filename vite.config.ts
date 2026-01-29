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
    // Inyectamos la llave en múltiples formatos para evitar fallos de resolución en navegadores móviles
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the Gemini SDK to access the API_KEY via process.env
    'process.env': process.env
  }
});

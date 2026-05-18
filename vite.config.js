import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'project',
  plugins: [react()],
  server: { port: 5173, host: true },
});

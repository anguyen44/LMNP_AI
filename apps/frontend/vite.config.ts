import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      allow: [
        path.resolve(__dirname), // allow serving files in this app
        path.resolve(__dirname, '../../'), // allow workspace root
      ],
    },
  },
});

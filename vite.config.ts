import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// GitHub Actions sets BASE_PATH from the actual repository name.
export default defineConfig({ plugins: [react(), tailwindcss()], base: process.env.BASE_PATH || './' });

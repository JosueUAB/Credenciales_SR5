import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isProd = command === 'build';
  return {
    plugins: [react()],
    base: isProd ? "/Credenciales_SR5/" : "/",
  };
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://JosueUAB.github.io/Credenciales_SR5", // Updated to user's repo
})

/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [svelte()],
  test: {
    globals: true,
    environment: 'jsdom',
  }
})

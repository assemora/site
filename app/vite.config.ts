/**
 * The site's bundle.
 *
 * `pnpm build` writes it into `app/dist`, and the application serves it at the origin
 * root. `base` has to match the path `frontend` is mounted at, or the document loads
 * and every script in it is a 404.
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  root: import.meta.dirname,
  base: '/',
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true },
})

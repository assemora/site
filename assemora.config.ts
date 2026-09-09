/**
 * How the `assemora` command finds this site (ADR-0021).
 */
import { defineConfig } from '@assemora/cli'

export default defineConfig({
  app: () => import('./src/app.ts').then((module) => module.createApp()),
  server: 'src/server.ts',
})

import { defineConfig } from '@playwright/test'

// E2E_MODE=preview sirve el build (vite preview); por defecto usa npm run dev.
// Ambos en loopback y bajo la base invariable de Vite.
const preview = process.env.E2E_MODE === 'preview'
const port = preview ? 5198 : 5199

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    headless: true,
  },
  webServer: {
    command: preview
      ? `npm run build && npx vite preview --host 127.0.0.1 --port ${port} --strictPort`
      : `npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}/Amirigumi-Mas_Las_Cosicas_de_Inma/`,
    reuseExistingServer: !preview,
    timeout: 120_000,
  },
})

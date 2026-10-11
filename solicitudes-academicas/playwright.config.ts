import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: '../evidencias/pruebas-automatizadas.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:4200',
    browserName: 'chromium',
    channel: process.env['BROWSER_CHANNEL'] || undefined,
    viewport: { width: 1440, height: 1000 },
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120000
  }
});

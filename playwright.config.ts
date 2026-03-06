import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  /* Налаштування репортерів */
  reporter: [
    ['list'], /* Вивід у консоль */
    ['json', { outputFile: 'raports/test-results.json' }], /* JSON звіт у вашу папку */
    ['html', { outputFolder: 'raports/html-report', open: 'never' }] /* HTML звіт теж у raports */
  ],
  use: {
    baseURL: 'http://127.0.0.1:8081',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

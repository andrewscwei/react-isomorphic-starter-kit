import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'null' : 'html',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
  },
  projects: [{
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  }, {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  }, {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  }, {
    name: 'Mobile Chrome',
    use: { ...devices['Pixel 5'] },
  }, {
    name: 'Mobile Safari',
    use: { ...devices['iPhone 12'] },
  }],
  webServer: {
    command: `npm run start:${process.env.RUNTIME || 'server'}`,
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
})

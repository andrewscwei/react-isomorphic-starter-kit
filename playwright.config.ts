import { defineConfig, devices } from '@playwright/test'

const CI = !!process.env.CI
const PORT = process.env.PORT || '8080'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
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
    url: `http://localhost:${PORT}`,
    reuseExistingServer: CI,
  },
})

import { defineConfig, devices } from '@playwright/test'

const CI = !!process.env.CI
const PORT = process.env.PORT || '8080'

export default defineConfig({
  forbidOnly: CI,
  fullyParallel: true,
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
  reporter: 'list',
  retries: CI ? 2 : 0,
  testDir: './tests',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npm run start:${process.env.RUNTIME || 'server'}`,
    reuseExistingServer: CI,
    url: `http://localhost:${PORT}`,
  },
  workers: CI ? 1 : undefined,
})

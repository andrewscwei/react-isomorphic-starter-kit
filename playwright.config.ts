import { defineConfig, devices } from '@playwright/test'

const PORT = process.env.PORT || '8080'
const CI = !!process.env.CI

const CHROMIUM = {
  name: 'chromium',
  use: { ...devices['Desktop Chrome'] },
}

const FIREFOX = {
  name: 'firefox',
  use: { ...devices['Desktop Firefox'] },
}

const WEBKIT = {
  name: 'webkit',
  use: { ...devices['Desktop Safari'] },
}

const MOBILE_CHROME = {
  name: 'Mobile Chrome',
  use: { ...devices['Pixel 5'] },
}

const MOBILE_SAFARI = {
  name: 'Mobile Safari',
  use: { ...devices['iPhone 12'] },
}

export default defineConfig({
  forbidOnly: CI,
  fullyParallel: true,
  projects: CI ? [CHROMIUM] : [CHROMIUM, FIREFOX, WEBKIT, MOBILE_CHROME, MOBILE_SAFARI],
  reporter: 'list',
  retries: CI ? 2 : 0,
  testDir: './tests',
  timeout: 5 * 60 * 1000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
})

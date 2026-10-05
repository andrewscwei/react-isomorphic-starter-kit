import { expect, type Page, test } from '@playwright/test'

const ROUTES = [
  '/',
]

const DEFAULT_LOCALE = 'en'

const LOCALES = [
  'en',
  'ja',
]

for (const locale of LOCALES) {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`

  for (const route of ROUTES) {
    const path = `${prefix}${route}`.replace(/(.)\/$/, '$1')

    test(`${path} renders`, async ({ page }) => {
      await expectPageHealthy(page, path)
    })
  }
}

test('home page links resolve', async ({ page }) => {
  await page.goto('/')

  const hrefs = await page.locator('a[href^="/"]').evaluateAll(els => els.map(el => el.getAttribute('href') ?? ''))
  const paths = [...new Set(hrefs.map(href => href.split('#')[0] ?? '').filter(Boolean))]

  for (const path of paths) {
    const response = await page.request.get(path)

    expect(response.status(), path).toBe(200)
  }
})

test('unknown route shows not found', async ({ page }) => {
  await page.goto('/smoke-missing')

  await expect(page).toHaveTitle('404')
})

async function expectPageHealthy(page: Page, path: string) {
  const errors: string[] = []

  page.on('pageerror', err => errors.push(`${err}`))
  page.on('response', response => {
    const url = new URL(response.url())

    if (!url.hostname.startsWith('localhost')) return
    if (response.request().resourceType() === 'document') return
    if (response.status() < 400) return

    errors.push(`${response.status()} ${url.pathname}`)
  })

  const response = await page.goto(path)

  expect(response?.status(), path).toBe(200)

  await page.waitForLoadState('networkidle')
  await expect(page).not.toHaveTitle('404')

  expect(errors, path).toEqual([])
}

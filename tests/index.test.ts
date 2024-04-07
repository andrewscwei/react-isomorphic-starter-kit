import { expect, test } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/React Isomorphic Starter Kit/)
})

test('quote link', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Quote' }).click()
  await expect(page.getByText('A quote from someone...')).toBeVisible()
  await expect(page.locator('#quote')).toHaveText(/\S/)
})

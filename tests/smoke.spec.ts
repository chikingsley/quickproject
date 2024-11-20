import { test, expect } from '@playwright/test'

test('smoke test - layout loads correctly', async ({ page }) => {
  await page.goto('/')
  
  // Check header
  await expect(page.getByText('QuickProject')).toBeVisible()
  await expect(page.getByText('Command Menu')).toBeVisible()
  
  // Check sidebar
  await expect(page.getByText('Overview')).toBeVisible()
  await expect(page.getByText('Dashboard')).toBeVisible()
  await expect(page.getByText('Projects')).toBeVisible()
  
  // Check main content area
  await expect(page.getByRole('main')).toBeVisible()
})

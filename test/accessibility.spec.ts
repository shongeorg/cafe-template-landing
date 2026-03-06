import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const URL = 'http://127.0.0.1:8081';

test('Accessibility audit', async ({ page }) => {
  await page.goto(URL);
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
    .analyze();

  console.log('Accessibility Violations:', accessibilityScanResults.violations.length);
  
  if (accessibilityScanResults.violations.length > 0) {
    console.log(JSON.stringify(accessibilityScanResults.violations, null, 2));
  }

  expect(accessibilityScanResults.violations.length).toBe(0);
});

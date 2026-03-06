import { test, expect } from '@playwright/test';

const URL = 'http://127.0.0.1:8081';

test('Performance metrics', async ({ page }) => {
  await page.goto(URL);
  
  const performanceTiming = await page.evaluate(() => {
    const timing = window.performance.timing;
    return {
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domReady: timing.domComplete - timing.domInteractive,
      ttfb: timing.responseStart - timing.navigationStart
    };
  });

  console.log('Performance Metrics:', JSON.stringify(performanceTiming, null, 2));
  
  // Перевірка, що завантаження менше 3 секунд (3000ms)
  expect(performanceTiming.loadTime).toBeLessThan(3000);
});

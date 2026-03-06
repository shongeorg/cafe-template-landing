import { test, expect } from '@playwright/test';

const URL = 'http://127.0.0.1:8081';

test('Check all images load and have alt text', async ({ page }) => {
  await page.goto(URL);
  
  const images = await page.$$eval('img', (imgs) => {
    return imgs.map(img => ({
      src: img.src,
      alt: img.alt,
      complete: img.complete,
      naturalWidth: img.naturalWidth
    }));
  });

  console.log(`Found ${images.length} images.`);

  for (const img of images) {
    // Перевірка наявності alt
    expect(img.alt.length).toBeGreaterThan(0);
    // Перевірка чи картинка завантажилась (naturalWidth > 0)
    expect(img.naturalWidth).toBeGreaterThan(0);
  }
});

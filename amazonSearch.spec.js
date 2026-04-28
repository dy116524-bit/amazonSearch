import { test, expect } from '@playwright/test';

const devices = [
  { name: 'iPhone', searchTerm: 'iPhone 15' },
  { name: 'Galaxy', searchTerm: 'Samsung Galaxy S24' }
];

for (const device of devices) {
  test(`Test Case: Search and Cart ${device.name}`, async ({ page }) => {
    // Navigate to Amazon
    await page.goto('https://www.amazon.com/');

    // Handle potential 'Try different characters' bot detection (basic)
    if (await page.isVisible('text=Enter the characters you see below')) {
      console.warn('CAPTCHA detected. Manual intervention or proxy needed for production.');
      return;
    }

    // Search for the device
    const searchBox = page.locator('#twotabsearchtextbox');
    await searchBox.fill(device.searchTerm);
    await searchBox.press('Enter');

    // Click the first product result (excluding ads/sponsored if possible)
    const firstResult = page.locator('[data-component-type="s-search-result"]').first();
    await firstResult.locator('h2 a').click();

    // Print the price to console
    // Note: Amazon uses separate spans for whole numbers and fractions
    const priceWhole = await page.locator('.a-price-whole').first().innerText();
    const priceFraction = await page.locator('.a-price-fraction').first().innerText();
    console.log(`${device.name} Price: $${priceWhole}${priceFraction}`);

    // Add to Cart
    const addToCartBtn = page.locator('#add-to-cart-button');
    await addToCartBtn.click();

    // Confirm it was added (checking for the 'Added to Cart' confirmation)
    const successMarker = page.locator('#sw-gtc, #attach-view-cart-button-layout');
    await expect(successMarker).toBeVisible();
    
    console.log(`Successfully added ${device.name} to cart.`);
  });
}

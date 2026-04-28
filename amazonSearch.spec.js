// tests/amazonSearch.spec.js
const { test, expect } = require('@playwright/test');

const SEARCH_DATA = [
  { id: 1, term: 'iPhone', testName: 'Search and Cart iPhone' },
  { id: 2, term: 'Galaxy', testName: 'Search and Cart Galaxy' },
];

for (const data of SEARCH_DATA) {
  test(data.testName, async ({ page }) => {
    // 1. Navigate to Amazon
    await page.goto('https://www.amazon.com/');

    // Note: Amazon often triggers CAPTCHAs on automated scripts. 
    // In a real environment, you'd use cookies or a proxy.
    
    // 2. Search for the device
    const searchBar = page.getByPlaceholder('Search Amazon');
    await searchBar.fill(data.term);
    await searchBar.press('Enter');

    // 3. Select the first non-sponsored result
    const firstResult = page.locator('[data-component-type="s-search-result"]').first();
    await firstResult.locator('h2 a').click();

    // 4. Scrape the price
    // Amazon's price selectors can vary, but .a-price-whole is standard for main listings
    const priceWhole = await page.locator('.a-price-whole').first().innerText();
    const priceFraction = await page.locator('.a-price-fraction').first().innerText();
    console.log(`Test Case ${data.id} - ${data.term} Price: $${priceWhole}${priceFraction}`);

    // 5. Add to Cart
    const addToCartButton = page.locator('#add-to-cart-button');
    await addToCartButton.click();

    // 6. Verify success (Amazon often opens a 'side-sheet' or new page)
    await expect(page.locator('#sw-gtc, #attach-view-cart-button-layout')).toBeVisible();
    console.log(`Test Case ${data.id} - ${data.term} successfully added to cart.`);
  });
}

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* This runs tests in parallel */
  fullyParallel: true, 
  /* Number of CPU cores to use. 'undefined' uses all available */
  workers: undefined, 
  reporter: 'list',
  use: {
    headless: false, // Set to true for faster, invisible execution
    screenshot: 'only-on-failure',
  },
});

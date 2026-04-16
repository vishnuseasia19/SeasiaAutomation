const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
   testDir: './tests',

  fullyParallel: false,   
  workers: 1,  

  reporter: 'html',

  use: {
    trace: 'on-first-retry',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: 'https://seasiaconnect.com',
    storageState: 'state.json',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
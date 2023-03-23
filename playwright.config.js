const { defineConfig, devices } = require('@playwright/test');

require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 2,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    // baseURL: 'https://staging-one.newrelic.com',
    baseURL: 'https://dev-one.newrelic.com/?nerdpacks=local',
    trace: 'on-first-retry',
  },

  projects: [
    { 
      name: 'setup', testMatch: /.*\.setup\.js/ 
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
    },
      dependencies: ['setup'],
    }, 
  ],
});


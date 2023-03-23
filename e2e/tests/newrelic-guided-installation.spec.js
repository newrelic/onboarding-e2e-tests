import { test, getUrl, expect } from '@playwright/test';

let page

test.describe('Guided installation for NR', () => {
  test.beforeEach(async ({ browser }) => {
     const context = await browser.newContext ({storageState : "e2e/sessions/storageState.json"})
     page = await context.newPage();
     await page.goto('/nr1-core/install-newrelic/installation-plan?e2e-test&');
});
  test('should validate default Auto-discovery guided installations', async ({ browser }) => {
    test.slow();
    await page
      .getByRole('heading', { name: 'Select your environment' })
      .isVisible();
    await page.getByTestId('install-newrelic.tile-linux').isVisible();
    await page.getByTestId('install-newrelic.tile-windows').isVisible();
    await page.getByTestId('install-newrelic.tile-docker').isVisible();
    await page.getByTestId('install-newrelic.tile-kubernetes').isVisible();
    await page.getByTestId('install-newrelic.tile-macos').isVisible();
    await page.getByRole('link', { name: '[See other options]' }).isVisible();
  });

  test('should validate default APM guided installations', async ({ browser }) => {
    test.slow();
    await page.getByText('APM (Application Monitoring)').click();
    await page
      .getByRole('heading', { name: 'Select your language' })
      .isVisible();
    await page.getByTestId('install-newrelic.tile-java').isVisible();
    await page.getByTestId('install-newrelic.tile-dotnet').isVisible();
    await page.getByTestId('install-newrelic.tile-php').isVisible();
    await page.getByTestId('install-newrelic.tile-nodejs').isVisible();
    await page.getByTestId('install-newrelic.tile-ruby').isVisible();
    await page.getByTestId('install-newrelic.tile-python').isVisible();
    await page.getByTestId('install-newrelic.tile-go').isVisible();
    //await page.getByRole('heading', { name: 'Auto-telemetry' }).isVisible();
    await page.getByTestId('install-newrelic.tile-kubernetes').isVisible();
  });
});

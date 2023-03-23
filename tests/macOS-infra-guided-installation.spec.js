// import { test, getUrl, expect } from '@nr1-cli/e2e';
import { test, getUrl, expect } from '@playwright/test';

let page

test.describe('Guided installation for NR', () => {
  test.beforeEach(async ({ browser }) => {
     const context = await browser.newContext ({storageState : "playwright/.auth/user.json"})
     page = await context.newPage();
     await page.goto('/nr1-core/install-newrelic/installation-plan?e2e-test&');
});
  test('should guide on steps to install macOS', async ({ browser }) => {
    
    test.slow();

    await page.getByRole('radio', { name: 'macOS' }).click();

    await page
      .getByRole('button', { name: 'Select your environment (macOS)' })
      .isVisible();

    await page.getByRole('button', { name: 'Begin installation' }).click();

    await page
      .getByText(
        `Homebrew must be installed to run this installation.This command only 
      supports installing the New Relic Infrastructure Agent. You will not be able to 
      instrument on host integrations or collect logs.`,
      )
      .isVisible();

    const [homebrewDocsLink] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Homebrew docs' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page.getByRole('heading', { name: 'Homebrew' }).isVisible();

    await homebrewDocsLink.close();

    const copyCommand = page.locator('#command-content');

    await page
      .getByRole('button', { name: 'Customize your installation' })
      .click();

    await expect(copyCommand).toContainText('NEW_RELIC_API_KEY=NRAK');

    await page.locator('#checkbox-0').isDisabled();

    await page.locator('#checkbox-0').isChecked();

    await page.locator('#checkbox-1').check();

    await page.getByText('Enter proxy URL').isVisible();

    await page.fill('[placeholder="http://my-proxy:3128"]', 'randomText');

    await expect(page.getByText('Invalid URL')).toBeVisible();

    await page.getByPlaceholder('http://my-proxy:3128').fill('');

    await page.fill(
      '[placeholder="http://my-proxy:3128"]',
      'http://test-proxy:8080',
    );

    await expect(copyCommand).toContainText(
      'HTTPS_PROXY=http://test-proxy:8080',
    );

    await page.locator('#checkbox-1').uncheck();

    await page.fill('[placeholder="key:value (Remaining: 10)"]', 'randomText');

    await page.getByPlaceholder('key:value (Remaining: 10)').press('Enter');

    await expect(
      page.getByText('Tag contains invalid character'),
    ).toBeVisible();

    // clear the input field
    await page.getByPlaceholder('key:value (Remaining: 10)').fill('');

    await page.fill('[placeholder="key:value (Remaining: 10)"]', 'Test:5');

    await page.getByPlaceholder('key:value (Remaining: 10)').press('Enter');

    await expect(copyCommand).toContainText('--tag Test:5');

    await page.getByRole('button', { name: 'Use a proxy' }).click();

    await page.locator('#checkbox-1').isChecked();

    await page.getByText('Enter proxy URL').isVisible();

    await page.locator('#checkbox-1').uncheck();

    await page.getByText('Enter proxy URL').isHidden();

    // using this identifier as test-id is unavailable for multiple elements with text "See our docs"
    const [docsLink] = await Promise.all([
      page.waitForEvent('popup'),
      page
        .locator(
          'div[role="status"]:has-text("We need access to a specific set of endpoints for this installation. Make sure y")',
        )
        .getByRole('link', { name: 'See our docs' })
        .click(),
    ]);

    await page.getByRole('heading', { name: 'Network traffic' }).isVisible();

    await docsLink.close();

    const [docsLink2] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'See our docs' }).nth(1).click(),
    ]);

    await page
      .getByRole('heading', { name: 'Guided install overview' })
      .isVisible();

    await docsLink2.close();

    await page.getByText('Give feedback').click();

    await expect(page.getByText('Help us improve New Relic One')).toBeVisible();

    await page.getByRole('button', { name: 'Close modal' }).click();

    await page.getByRole('button', { name: 'Back' }).nth(1).click();
  });
});

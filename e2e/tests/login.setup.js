import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('https://staging-login.newrelic.com/login');
  await page.getByRole('heading', { name: 'Log in to your organization' }).isVisible();
  await page.locator('#login_email').click();
  await page.locator('#login_email').fill(process.env.E2E_DEFAULT_EMAIL);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('#login_password').fill(process.env.E2E_DEFAULT_PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();

  await page.context().storageState({ path: 'e2e/sessions/storageState.json' });
});

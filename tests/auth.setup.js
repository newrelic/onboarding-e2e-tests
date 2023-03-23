import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  // console.log("Email --", process.env.ENV_SECRET_EMAIL)
  // console.log("Password --", process.env.ENV_SECRET_PASSWORD)
  await page.goto('https://staging-login.newrelic.com/login');
  await page.getByRole('heading', { name: 'Log in to your organization' }).isVisible();
  await page.locator('#login_email').click();
  await page.locator('#login_email').fill(process.env.ENV_SECRET_EMAIL);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('#login_password').fill(process.env.ENV_SECRET_PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();

  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});

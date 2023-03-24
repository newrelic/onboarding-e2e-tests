import { test, expect } from "@playwright/test";
const { chromium } = require("playwright");

let browser;
let context;
let page;

test.beforeEach(async () => {
  browser = await chromium.launch();
  context = await browser.newContext({
    storageState: "e2e/sessions/storageState.json",
  });
  page = await context.newPage();
  await page.waitForLoadState("networkidle");
  await page.goto("/nr1-core/install-newrelic/installation-plan?e2e-test&");
});

test.afterEach(async () => {
  await context.close();
});

test.afterAll(async () => {
  await browser.close();
});


  test('should show steps to install Kubernetes', async () => {
    test.slow();

    await page.getByRole('radio', { name: 'Kubernetes' }).click();

    await page
      .getByRole('button', { name: 'Select your environment (Kubernetes)' })
      .isVisible();

    await page.getByRole('button', { name: 'Begin installation' }).click();

    await page.getByText('Kubernetes integration.').isVisible();

    await page
      .getByText(
        `New Relic's Kubernetes integration gives you full observability 
            into the health and performance of your environment, no matter whether you run 
            Kubernetes on-premises or in the cloud.`,
      )
      .isVisible();

    await page.getByText('Configure the Kubernetes integration').isVisible();

    await page.getByRole('button', { name: 'Continue' }).isDisabled();

    await page.locator('#text-field-2').fill('TestCluster');

    await page.getByRole('button', { name: 'Continue' }).isEnabled();

    await page.getByRole('button', { name: 'Continue' }).click();

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'Select the additional data you want to gather',
      })
      .isVisible();

    // expect(await page.locator('#checkbox-0').isChecked()).toBeTruthy();

    // expect(await page.locator('#checkbox-3').isChecked()).toBeTruthy();

    // expect(await page.locator('#checkbox-5').isChecked()).toBeTruthy();

    await page.getByRole('button', { name: 'Continue' }).click();

    await page.waitForLoadState('networkidle');

    const installMethodDescription = `Guided install uses the New Relic CLI to check the prerequisites and 
            configures the integration.It uses Helm to deploy the integration.If Helm is not available it creates 
            and applies a manifest with kubectl.`;

    await page.getByText(installMethodDescription).isVisible();

    const copyCommand = page.locator('#command-content');

    await expect(copyCommand).toContainText(
      'install -n kubernetes-open-source-integration',
    );

    await page.getByRole('tab', { name: 'Helm 3' }).click();

    //since no identifier is provided, unable to validate the below text under Helm
    // await expect(recipeID).toContainText(
    //   'helm repo add newrelic https://helm-charts.newrelic.com && helm repo update',
    // );

    await page.getByRole('tab', { name: 'Manifest' }).click();

    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Listening for data')).toBeVisible();

    await expect(
      page.getByText('Pixie: get ready for next-gen K8s observability!'),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();

    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Back' }).click();

    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Back' }).click();

    await page.getByText('copy the permalink to this page').click();

    await page.getByText('copied!').isVisible();

    const [docsLink] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'See our docs' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'Introduction to the Kubernetes integration',
      })
      .isVisible();

    await docsLink.close();

    await page.getByText('Give feedback').click();

    await expect(page.getByText('Help us improve New Relic One')).toBeVisible();

    await page.getByRole('button', { name: 'Close modal' }).click();

    //await page.getByRole('button', { name: 'Back' }).click();
  });

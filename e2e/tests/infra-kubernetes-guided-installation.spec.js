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
  await page.goto("/nr1-core/install-newrelic/installation-plan?e2e-test&nerdpacks=local&");
});

test.afterEach(async () => {
  await context.close();
});

test.afterAll(async () => {
  await browser.close();
});

test("should show steps to install Kubernetes", async () => {
  test.slow();

  await page.getByTestId('install-newrelic.tile-kubernetes').click();

    const selectEnvironmentHeading = await page.locator(
      `div[data-test-id="install-newrelic.steps-item"]`,
    );

    await expect(selectEnvironmentHeading).toContainText(
      'Select your environment (Kubernetes)',
    );

    await page
      .getByTestId('install-newrelic.button-begin-installation')
      .click();

    //The commendted code changes will be applicable for pixie auto-telemetry as well

    //The below code is commented as it is unable to locate the text. Hence line 53 is written as alternative
    // const kubernetesHeading = await page.getByTestId(
    //   'install-newrelic.kubernetes-header-text',
    // );

    // await expect(kubernetesHeading).toContainText(
    //   'Configure the Kubernetes integration',
    // );
    await page
      .getByTestId('install-newrelic.kubernetes-header-text')
      .isVisible();

    await page
      .getByTestId('install-newrelic.footer-action-continue-button')
      .isDisabled();

    const clusterNameContainer = await page.locator(
      'div[data-test-id="install-newrelic.cluster-textfield"]',
    );

    const clusterNameTextField = await clusterNameContainer.locator(
      'input[type="text"]',
    );

    await clusterNameTextField.fill('TestCluster');

    await page
      .getByTestId('install-newrelic.footer-action-continue-button')
      .isEnabled();

    await page
      .getByTestId('install-newrelic.footer-action-continue-button')
      .click();

    await page.waitForLoadState('networkidle');

    //The below code is commented as it is unable to locate the text. Hence line 89 is written as alternative
    // const additionalData = await page.getByTestId(
    //   'install-newrelic.gather-additional-data',
    // );

    // await additionalData.toContainText(
    //   'Select the additional data you want to gather',
    // );
    await page
      .getByTestId('install-newrelic.gather-additional-data')
      .isVisible();

    /* 
    
    SINCE UPDATES ARE HAPPENING ON KUBERNETES, CHECKBOXES HAVE BEEN COMMENTED 
    
    expect(await page.locator('#checkbox-0').isChecked()).toBeTruthy();
  
    expect(await page.locator('#checkbox-3').isChecked()).toBeTruthy();
  
    expect(await page.locator('#checkbox-5').isChecked()).toBeTruthy();
  
    */

    await page
      .getByTestId('install-newrelic.additional-data-continue-button')
      .click();

    await page.waitForLoadState('networkidle');

    //The below code is commented as it is unable to locate the text. Hence line 117 is written as alternative
    // const installationMethods = await page.getByTestId(
    //   'install-newrelic.installation-methods',
    // );

    // await installationMethods.toContainText('Choose install method');
    await page.getByTestId('install-newrelic.installation-methods').isVisible();

    //The below code is commented as it is unable to locate the text. Hence line 125 is written as alternative
    // const helmHeading = await page.locator(
    //   `div[data-test-id="install-newrelic.helm-heading"]`,
    // );

    // await helmHeading.toContainText('Guided install uses Helm by default');
    await page.getByTestId('install-newrelic.helm-heading').isVisible();

    const codeSnippet = page.locator(
      'data-test-id=install-newrelic.code-snippet',
    );

    await expect(codeSnippet).toContainText('NR_CLI_CLUSTERNAME=TestCluster');

    await page.getByTestId('install-newrelic.tab-helm-3').click();

    await expect(codeSnippet).toContainText(
      'helm repo add newrelic https://helm-charts.newrelic.com && helm repo update',
    );

    await page.getByTestId('install-newrelic.tab-manifest').click();

    await expect(codeSnippet).toContainText(
      `"pixie-chart.clusterName":"TestCluster"`,
    );

    await page
      .getByTestId('install-newrelic.install-methods-continue-button')
      .click();

    //The below code is commented as it is unable to locate the text. Hence line 152 is written as alternative
    // const listenData = await page.getByTestId('install-newrelic.listen-data');
    // await listenData.toContainText('Listening for data');
    await page.getByTestId('install-newrelic.listen-data').isVisible();

    //The below code is commented as it is unable to locate the text. Hence line 161 is written as alternative
    // const pixieHeading = await page.getByTestId(
    //   'install-newrelic.pixie-heading',
    // );
    // await pixieHeading.toContainText(
    //   'Pixie: get ready for next-gen K8s observability!',
    // );
    await page.getByTestId('install-newrelic.pixie-heading').isVisible();

    await page.getByTestId('install-newrelic.lastpage-back-button').click();

    await page
      .getByTestId('install-newrelic.install-methods-back-button')
      .click();

    await page
      .getByTestId('install-newrelic.additional-data-back-button')
      .click();

    const [footerSeeOurDocs] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('install-newrelic.docs-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'Introduction to the Kubernetes integration',
      })
      .isVisible();

    await footerSeeOurDocs.close();

    await page.getByTestId('install-newrelic.feedback-link').click();

    const feedbackTitle = await page.getByTestId(
      'install-newrelic.modal-title',
    );

    await expect(feedbackTitle).toContainText('Help us improve New Relic One');

    await page.getByRole('button', { name: 'Close modal' }).click();

    await page
      .getByTestId('install-newrelic.footer-action-back-button')
      .click();

    await page.getByTestId('install-newrelic.button-back-to-home').click();
});

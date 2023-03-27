import { test, expect } from '@playwright/test';
const { chromium } = require('playwright');

let browser;
let context;
let page;

test.beforeEach(async () => {
  browser = await chromium.launch();
  context = await browser.newContext({
    storageState: 'e2e/sessions/storageState.json',
  });
  page = await context.newPage();
  await page.waitForLoadState('networkidle');
  await page.goto('/nr1-core/install-newrelic/installation-plan?e2e-test&');
});

test.afterEach(async () => {
  await context.close();
});

test.afterAll(async () => {
  await browser.close();
});

test.describe('PHP Guided installation', () => {
  test('should show available methods to install the PHP agent', async () => {
    test.slow();

    await page.getByText('APM (Application Monitoring)').click();

    await page.getByTestId('install-newrelic.tile-php').click();

    await page.getByRole('button', { name: 'Select your language (PHP)' }).isVisible();

    await expect(page.getByText('Install the PHP agent')).toBeVisible();

    await page.getByRole('button', { name: 'Begin installation' }).click();

    await page.waitForLoadState('networkidle');

    await expect(page.getByText('How do you want to install the PHP agent?')).toBeVisible();

    await expect(page.getByText('On host', { exact: true })).toBeVisible();

    await expect(page.getByText('On host standard', { exact: true })).toBeVisible();

    await expect(page.getByText('Docker', { exact: true })).toBeVisible();

    await expect(page.getByText('Package manager', { exact: true })).toBeVisible();

    await expect(page.getByText('Hosting provider', { exact: true })).toBeVisible();

    await expect(page.getByText('AWS Lambda', { exact: true })).toBeVisible();

    const [docsLink] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'See our docs' }).click(),
    ]);

    await docsLink.waitForLoadState('networkidle');

    await docsLink.getByRole('heading', { name: 'Guided install overview' }).isVisible();

    await docsLink.close();

    await page.getByText('Give feedback').click();

    await expect(page.getByText('Help us improve New Relic One')).toBeVisible();

    await page.getByRole('button', { name: 'Close modal' }).click();

    await page.getByTestId('install-newrelic.apm-footer-back-button').click();
  });

  test('should guide steps to install the PHP agent on host', async () => {
    test.slow();

    await page.getByText('APM (Application Monitoring)').click();

    await page.getByTestId('install-newrelic.tile-php').click();

    await page.getByRole('button', { name: 'Begin installation' }).click();

    await page.waitForLoadState('networkidle');

    await page.getByText('On host', { exact: true }).click();

    const firewallMessage =
      'To allow data through your firewall, set the HTTPS_PROXY environment variable to your proxy’s URL before you run the command below.';

    await expect(page.getByText(firewallMessage)).toBeVisible();

    const installationCommand = `curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh`;

    await expect(page.getByTestId('install-newrelic.code-snippet')).toContainText(installationCommand);

    const [footerDocsLink] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('install-newrelic.docs-link').click(),
    ]);

    await footerDocsLink.waitForLoadState('networkidle');

    await footerDocsLink.getByRole('heading', { name: 'Guided install overview' }).isVisible();

    await footerDocsLink.close();

    await page.getByTestId('install-newrelic.feedback-link').click();

    await expect(page.getByText('How is New Relic One working for you, right now?')).toBeVisible();

    await page.getByRole('button', { name: 'Close modal' }).click();

    await page.getByRole('button', { name: 'PHP standard installation' }).click();

    await page.getByRole('heading', { name: 'Add your PHP application data' }).isVisible();

    await page.getByRole('heading', { name: 'Give your application a name' }).isVisible();

    const [seeAppNamingDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'See our docs on naming' }).click(),
    ]);

    await seeAppNamingDoc.waitForLoadState('networkidle');

    await seeAppNamingDoc.getByText('Name or change the name of your application').isVisible();

    await seeAppNamingDoc.close();

    await page.getByRole('button', { name: 'See your data' }).isDisabled();

    await page.getByRole('textbox').fill('testApp');

    await page.getByLabel('apt').check();

    await page.getByText('sudo apt-get -y install newrelic-php5').isVisible();

    await page.getByRole('button', { name: 'See your data' }).isEnabled();

    await expect(
      page.getByText('Copy this command into your host to enable infrastructure and logs metrics.')
    ).toBeVisible();

    /* NEED TO DEFINE data-test-id FOR LINUX COMMAND SNIPPET */

    await page.getByRole('tab', { name: 'Windows' }).click();

    /* NEED TO DEFINE data-test-id FOR WINDOWS COMMAND SNIPPET */

    await page.getByRole('tab', { name: 'Docker' }).click();

    /* NEED TO DEFINE data-test-id FOR DOCKER COMMAND SNIPPET */

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Install the PHP agent' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'PHP agent installation overview',
      })
      .isVisible();

    await agentInstallationDoc.close();

    const [agentNamingDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'How to name your app' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'Name or change the name of your application',
      })
      .isVisible();

    await agentNamingDoc.close();

    const [distributedTracingLink] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Distributed tracing' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page.getByRole('heading', { name: 'Introduction to distributed tracing' }).isVisible();

    await distributedTracingLink.close();

    const [compatibilityAndRequirementsDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Compatibility and requirements' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'PHP agent compatibility and requirements',
      })
      .isVisible();

    await compatibilityAndRequirementsDoc.close();

    await page.getByTestId('platform.user-feedback-button').nth(1).click();

    await page.getByRole('heading', { name: 'Do you have specific feedback for us?' }).isVisible();

    await page.getByRole('button', { name: 'Close modal' }).click();

    await page.getByTestId('platform.stacked-view-close-button').nth(1).click();
  });

  test('should guide steps to install the PHP agent On host standard', async () => {
    test.slow();

    await page.getByText('APM (Application Monitoring)').click();

    await page.getByRole('radio', { name: 'PHP' }).click();

    await page.getByRole('button', { name: 'Begin installation' }).click();

    await page.getByRole('heading', { name: 'On host standard' }).click();

    await page.getByRole('heading', { name: 'Add your PHP application data' }).isVisible();

    await page.getByRole('heading', { name: 'Give your application a name' }).isVisible();

    const [seeAppNamingDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'See our docs on naming' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page.getByText('Name or change the name of your application').isVisible();

    await seeAppNamingDoc.close();

    await page.getByRole('button', { name: 'See your data' }).isDisabled();

    await page.getByRole('textbox').fill('testApp');

    await page.getByLabel('Docker').check();

    await page.getByText('docker pull newrelic/php-daemon').isVisible();

    await page.getByRole('button', { name: 'See your data' }).isEnabled();

    await expect(
      page.getByText('Copy this command into your host to enable infrastructure and logs metrics.')
    ).toBeVisible();

    /* NEED TO DEFINE data-test-id FOR LINUX COMMAND SNIPPET */

    await page.getByRole('tab', { name: 'Windows' }).click();

    /* NEED TO DEFINE data-test-id FOR WINDOWS COMMAND SNIPPET */

    await page.getByRole('tab', { name: 'Docker' }).click();

    /* NEED TO DEFINE data-test-id FOR DOCKER COMMAND SNIPPET */

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Install the PHP agent' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page.getByRole('heading', { name: 'PHP agent installation overview' }).isVisible();

    await agentInstallationDoc.close();

    const [agentNamingDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'How to name your app' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'Name or change the name of your application',
      })
      .isVisible();

    await agentNamingDoc.close();

    const [distributedTracingLink] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Distributed tracing' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page.getByRole('heading', { name: 'Introduction to distributed tracing' }).isVisible();

    await distributedTracingLink.close();

    const [compatibilityAndRequirementsDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Compatibility and requirements' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'PHP agent compatibility and requirements',
      })
      .isVisible();

    await compatibilityAndRequirementsDoc.close();

    await page.getByTestId('platform.user-feedback-button').nth(1).click();

    await page.getByRole('heading', { name: 'Do you have specific feedback for us?' }).isVisible();

    await page.getByRole('button', { name: 'Close modal' }).click();

    await page.getByTestId('platform.stacked-view-close-button').nth(1).click();
  });

  test('should guide steps to install the PHP agent through Docker', async () => {
    test.slow();

    await page.getByText('APM (Application Monitoring)').click();

    await page.getByRole('radio', { name: 'PHP' }).click();

    await page.getByRole('button', { name: 'Begin installation' }).click();

    await page.getByRole('heading', { name: 'Docker' }).click();

    await page.getByRole('heading', { name: 'Add your PHP application data' }).isVisible();

    await page.getByRole('heading', { name: 'Give your application a name' }).isVisible();

    const [seeAppNamingDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'See our docs on naming' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page.getByText('Name or change the name of your application').isVisible();

    await seeAppNamingDoc.close();

    await page.getByRole('button', { name: 'See your data' }).isDisabled();

    await page.getByRole('textbox').fill('testApp');

    await page.getByLabel('Docker').check();

    await page.getByText('docker network create newrelic-php').isVisible();

    await page.getByRole('button', { name: 'See your data' }).isEnabled();

    await expect(
      page.getByText('Copy this command into your host to enable infrastructure and logs metrics.')
    ).toBeVisible();

    /* NEED TO DEFINE data-test-id FOR LINUX COMMAND SNIPPET */

    await page.getByRole('tab', { name: 'Windows' }).click();

    /* NEED TO DEFINE data-test-id FOR WINDOWS COMMAND SNIPPET */

    await page.getByRole('tab', { name: 'Docker' }).click();

    /* NEED TO DEFINE data-test-id FOR DOCKER COMMAND SNIPPET */

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Install the PHP agent' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page.getByRole('heading', { name: 'PHP agent installation overview' }).isVisible();

    await agentInstallationDoc.close();

    const [agentNamingDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'How to name your app' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'Name or change the name of your application',
      })
      .isVisible();

    await agentNamingDoc.close();

    const [distributedTracingLink] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Distributed tracing' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page.getByRole('heading', { name: 'Introduction to distributed tracing' }).isVisible();

    await distributedTracingLink.close();

    const [compatibilityAndRequirementsDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Compatibility and requirements' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'PHP agent compatibility and requirements',
      })
      .isVisible();

    await compatibilityAndRequirementsDoc.close();

    await page.getByTestId('platform.user-feedback-button').nth(1).click();

    await page.getByRole('heading', { name: 'Do you have specific feedback for us?' }).isVisible();

    await page.getByRole('button', { name: 'Close modal' }).click();

    await page.getByTestId('platform.stacked-view-close-button').nth(1).click();
  });

  test('should guide steps to install the PHP agent through Package manager', async () => {
    test.slow();

    await page.getByText('APM (Application Monitoring)').click();

    await page.getByRole('radio', { name: 'PHP' }).click();

    await page.getByRole('button', { name: 'Begin installation' }).click();

    await page.getByRole('heading', { name: 'Package manager' }).click();

    await page.getByRole('heading', { name: 'Add your PHP application data' }).isVisible();

    await page.getByRole('heading', { name: 'Give your application a name' }).isVisible();

    const [seeAppNamingDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'See our docs on naming' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page.getByText('Name or change the name of your application').isVisible();

    await seeAppNamingDoc.close();

    await page.getByRole('button', { name: 'See your data' }).isDisabled();

    await page.getByRole('textbox').fill('testApp');

    await page.getByLabel('yum').check();

    await page.getByText('sudo yum install newrelic-php5').isVisible();

    await page.getByRole('button', { name: 'See your data' }).isEnabled();

    await expect(
      page.getByText('Copy this command into your host to enable infrastructure and logs metrics.')
    ).toBeVisible();

    /* NEED TO DEFINE data-test-id FOR LINUX COMMAND SNIPPET */

    await page.getByRole('tab', { name: 'Windows' }).click();

    /* NEED TO DEFINE data-test-id FOR WINDOWS COMMAND SNIPPET */

    await page.getByRole('tab', { name: 'Docker' }).click();

    /* NEED TO DEFINE data-test-id FOR DOCKER COMMAND SNIPPET */

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Install the PHP agent' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page.getByRole('heading', { name: 'PHP agent installation overview' }).isVisible();

    await agentInstallationDoc.close();

    const [agentNamingDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'How to name your app' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'Name or change the name of your application',
      })
      .isVisible();

    await agentNamingDoc.close();

    const [distributedTracingLink] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Distributed tracing' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page.getByRole('heading', { name: 'Introduction to distributed tracing' }).isVisible();

    await distributedTracingLink.close();

    const [compatibilityAndRequirementsDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Compatibility and requirements' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'PHP agent compatibility and requirements',
      })
      .isVisible();

    await compatibilityAndRequirementsDoc.close();

    await page.getByTestId('platform.user-feedback-button').nth(1).click();

    await page.getByRole('heading', { name: 'Do you have specific feedback for us?' }).isVisible();

    await page.getByRole('button', { name: 'Close modal' }).click();

    await page.getByTestId('platform.stacked-view-close-button').nth(1).click();
  });

  test('should guide steps to install the PHP agent through Hosting provider', async () => {
    test.slow();

    await page.getByText('APM (Application Monitoring)').click();

    await page.getByRole('radio', { name: 'PHP' }).click();

    await page.getByRole('button', { name: 'Begin installation' }).click();

    const [hostingProviderDocs] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Hosting provider' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'Install PHP with partnership accounts',
      })
      .isVisible();

    await hostingProviderDocs.close();
  });
});

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

test("should shows steps to install the Go agent", async () => {
  test.slow();

  await page.getByTestId('install-newrelic.apm-tab').click();

    await page.getByTestId('install-newrelic.tile-go').click();

    const selectEnvironmentHeading = await page.locator(
      `div[data-test-id="install-newrelic.steps-item"]`,
    );

    await expect(selectEnvironmentHeading).toContainText(
      'Select your language (Go)',
    );

    const installGo = await page.getByTestId('install-newrelic.title');
    await expect(installGo).toContainText('Install the Go agent');

    await page
      .getByTestId('install-newrelic.button-begin-installation')
      .click();

    await page.waitForLoadState('networkidle');

    const addGo = page.getByTestId('setup.heading');

    await expect(addGo).toContainText('Add your Go application data');

    const appName = page.getByTestId('setup.application-name');

    await expect(appName).toContainText('Give your application a name');

    const [seeAppNamingDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'See our docs on naming' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByText('Name or change the name of your application')
      .isVisible();

    await seeAppNamingDoc.close();

    await page.getByTestId('setup.see-your-data-button').isDisabled();

    const appNameDiv = await page.locator(
      'div[data-test-id="setup.naming-textfield"]',
    );
    const appNameField = await appNameDiv.locator('input[type="text"]');

    await appNameField.fill('testApp');

    await page.getByTestId('setup.see-your-data-button').isEnabled();

    const commandTitle = page.getByTestId('setup.command-title');
    await expect(commandTitle).toContainText(
      'Run this command to get the Go agent:',
    );

    const goCommand = page.getByTestId(`setup.go-agent-command`);
    await expect(goCommand).toContainText(
      `go get github.com/newrelic/go-agent/v3`,
    );

    await expect(
      page.getByText(`Add this code to your main function or init block:`),
    ).toBeVisible();

    await expect(page.getByTestId('setup.initialize-go-command')).toContainText(
      `newrelic.NewApplication`,
    );

    const monitoringTitle = page.getByTestId('setup.monitoring-title');
    await expect(monitoringTitle).toContainText(
      'To monitor web transactions, in your app code wrap standard HTTP requests. For example:',
    );

    const importPackageCommand = page.getByTestId(
      'setup.import-package-command',
    );
    await expect(importPackageCommand).toContainText(
      `http.HandleFunc(newrelic.WrapHandleFunc(app, "/users", usersHandler))`,
    );

    await expect(
      page.getByText(
        'Copy this command into your host to enable infrastructure and logs metrics.',
      ),
    ).toBeVisible();

    await expect(page.getByTestId('setup.agent-commands')).toContainText(
      `NEW_RELIC_ACCOUNT_ID=`,
    );

    const tabItems = await page.locator(`button[data-test-id="setup.tabs"]`);

    await tabItems.nth(1).click();

    await expect(page.getByTestId('setup.agent-commands')).toContainText(
      `$env:NEW_RELIC_API_KEY=`,
    );

    await tabItems.nth(2).click();

    await expect(page.getByTestId('setup.agent-commands')).toContainText(
      `NRIA_LICENSE_KEY=`,
    );

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByTestId('setup.install-go-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', { name: 'Install New Relic for Go' })
      .isVisible();

    await agentInstallationDoc.close();

    const [agentConfigDoc] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByTestId('setup.go-config-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', { name: 'Go agent configuration' })
      .isVisible();

    await agentConfigDoc.close();

    const [agentNamingDoc] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByTestId('setup.app-naming-link').click(),
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
      await page.getByTestId('setup.distributed-tracing-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', { name: 'Introduction to distributed tracing' })
      .isVisible();

    await distributedTracingLink.close();

    const [GoAgentLogsDoc] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByTestId('setup.application-logs-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', { name: 'Go agent logs in context' })
      .isVisible();

    await GoAgentLogsDoc.close();

    const [compatibilityDoc] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByTestId('setup.compatibility-requirement-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', { name: 'Go agent compatibility and requirements' })
      .isVisible();

    await compatibilityDoc.close();

    const [agentLoggingConfigDoc] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByTestId('setup.configure-agent-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page.getByRole('heading', { name: 'Go agent logging' }).isVisible();

    await agentLoggingConfigDoc.close();

    await page.waitForLoadState('networkidle');

    await page.getByTestId('platform.user-feedback-button').click();

    await page
      .getByRole('heading', { name: 'Do you have specific feedback for us?' })
      .click();

    await page.getByRole('button', { name: 'Close modal' }).click();

    await page.getByTestId('platform.stacked-view-close-button').click();

    await page.getByTestId('install-newrelic.button-back-to-home').click();
});

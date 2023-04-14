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

test("should shows steps to install the Ruby", async () => {
  test.slow();

  await page.getByTestId('install-newrelic.apm-tab').click();

  await page.getByTestId('install-newrelic.tile-ruby').click();

  const selectEnvironmentHeading = await page.locator(
    `div[data-test-id="install-newrelic.steps-item"]`,
  );

  await expect(selectEnvironmentHeading).toContainText(
    'Select your language (Ruby)',
  );

  const installRuby = await page.getByTestId('install-newrelic.title');
  await expect(installRuby).toContainText('Install the Ruby agent');

  await page
    .getByTestId('install-newrelic.button-begin-installation')
    .click();

  await page.waitForLoadState('networkidle');

  const addRuby = page.getByTestId('setup.heading');

  await expect(addRuby).toContainText('Add your Ruby application data');

  const [seeAppNamingDoc] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'See our docs on naming' }).click(),
  ]);

  await page.waitForLoadState('networkidle');

  await page
    .getByText('Name or change the name of your application')
    .isVisible();

  await seeAppNamingDoc.close();

  const downloadFile = page.getByTestId('setup.download-file');
  await expect(downloadFile).toContainText(
    'Download your custom configuration file',
  );

  await page.getByTestId('setup.download-button').isDisabled();

  const warningText = page.getByTestId('setup.warning-text');
  await expect(warningText).toContainText(
    'You must complete steps  1, and 2',
  );

  const applicationNameContainer = await page.locator(
    'div[data-test-id="setup.naming-textfield"]',
  );

  const applicationNameInput = await applicationNameContainer.locator(
    'input[type="text"]',
  );

  await applicationNameInput.fill('testApp');

  const bundlerHeading = page.getByTestId('setup.bundler-heading');
  await expect(bundlerHeading).toContainText('Are you using Bundler?');

  const bundlerOptions = await page.locator(
    'div[data-test-id="setup.bundler"]',
  );

  const bundlerRadio = await bundlerOptions.locator('input[type="radio"]');

  await bundlerRadio.check();

  await page.getByTestId('setup.download-button').isEnabled();

  await expect(page.getByText('You must complete step 2')).toBeHidden();

  const gemFile = page.getByTestId('setup.gemfile');
  await expect(gemFile).toContainText('Add the agent gem to your Gemfile:');

  const addAgentCommand = page.getByTestId('setup.add-agent-command');
  await expect(addAgentCommand).toContainText(`gem 'newrelic_rpm'`);

  const bundleGemFile = page.getByTestId('setup.bundle-gemfile');
  await expect(bundleGemFile).toContainText(
    'Make sure it gets added to your Bundle Gemfile:',
  );

  const bundleInstall = page.getByTestId('setup.bundle-install-command');
  await expect(bundleInstall).toContainText(`bundle install`);

  const noBundler = await page.locator(
    'div[data-test-id="setup.no-bundler"]',
  );

  const noBundlerRadio = await noBundler.locator('input[type="radio"]');

  await noBundlerRadio.check();

  const installGem = page.getByTestId('setup.install-gem');
  await expect(installGem).toContainText('Install the agent using gem:');

  const gemCode = page.getByTestId('setup.install-using-gem-command');
  await expect(gemCode).toContainText(`gem install newrelic_rpm`);

  const redirectiveCommand = page.getByTestId(
    'setup.require-directive-command',
  );
  await expect(redirectiveCommand).toContainText(`require 'newrelic_rpm'`);

  await expect(page.getByTestId('setup.agent-commands')).toContainText(
    `NEW_RELIC_API_KEY=NRAK-`,
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

  const [rubyInstallationDoc] = await Promise.all([
    page.waitForEvent('popup'),
    await page.getByTestId('setup.install-ruby-link').click(),
  ]);

  await page.waitForLoadState('networkidle');

  await rubyInstallationDoc
    .getByRole('heading', {
      name: 'Install the New Relic Ruby agent',
    })
    .click();

  await rubyInstallationDoc.close();

  const [appNamingDoc] = await Promise.all([
    page.waitForEvent('popup'),
    await page.getByTestId('setup.app-naming-link').click(),
  ]);

  await page.waitForLoadState('networkidle');

  await appNamingDoc
    .getByRole('heading', {
      name: 'Name or change the name of your application',
    })
    .click();

  await appNamingDoc.close();

  const [distributedTracingLink] = await Promise.all([
    page.waitForEvent('popup'),
    await page.getByTestId('setup.distributed-tracing-link').click(),
  ]);

  await distributedTracingLink
    .getByRole('heading', {
      name: 'Introduction to distributed tracing',
    })
    .click();

  await distributedTracingLink.close();

  const [supportedFrameworkDoc] = await Promise.all([
    page.waitForEvent('popup'),
    await page.getByTestId('setup.requirement-link').click(),
  ]);

  await supportedFrameworkDoc
    .getByRole('heading', {
      name: 'Ruby agent requirements and supported frameworks',
    })
    .click();

  await supportedFrameworkDoc.close();

  await page.getByTestId('platform.user-feedback-button').click();

  await page
    .getByRole('heading', { name: 'Do you have specific feedback for us?' })
    .click();

  await page.getByRole('button', { name: 'Close modal' }).click();

  await page.getByTestId('platform.stacked-view-close-button').click();

  await page.getByTestId('install-newrelic.button-back-to-home').click();
});

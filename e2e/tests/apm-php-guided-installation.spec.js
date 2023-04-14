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

test.describe("PHP Guided installation", () => {
  test('should show available methods to install the PHP agent', async () => {
    test.slow();

    await page.getByTestId('install-newrelic.apm-tab').click();

    await page.getByTestId('install-newrelic.tile-php').click();

    const selectEnvironmentHeading = await page.locator(
      `div[data-test-id="install-newrelic.steps-item"]`,
    );

    await expect(selectEnvironmentHeading).toContainText(
      'Select your language (PHP)',
    );

    const installPHP = await page.getByTestId('install-newrelic.title');

    await expect(installPHP).toContainText('Install the PHP agent');

    await page
      .getByTestId('install-newrelic.button-begin-installation')
      .click();

    await page.waitForLoadState('networkidle');

    const installationTitle = page.getByTestId(
      'install-newrelic.installation-title',
    );
    await expect(installationTitle).toContainText(
      'How do you want to install the PHP agent?',
    );

    const phpOnHost = page.getByTestId('install-newrelic.php-on-host');

    await expect(phpOnHost).toContainText('On host');

    const phpHostStandard = page.getByTestId(
      'install-newrelic.php-host-standard',
    );

    await expect(phpHostStandard).toContainText('On host standard');

    const phpDocker = page.getByTestId('install-newrelic.php-docker');

    await expect(phpDocker).toContainText('Docker');

    const packageManager = page.getByTestId(
      'install-newrelic.php-package-manager',
    );

    await expect(packageManager).toContainText('Package manager');

    const hostingProvider = page.getByTestId(
      'install-newrelic.hosting-provider-doc',
    );

    await expect(hostingProvider).toContainText('Hosting provider');

    await page.getByRole('heading', { name: 'AWS Lambda' }).isVisible();

    const [footerSeeOurDocs] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('install-newrelic.docs-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', { name: 'Guided install overview' })
      .isVisible();

    await footerSeeOurDocs.close();

    await page.getByTestId('install-newrelic.feedback-link').click();

    const feedbackTitle = await page.getByTestId(
      'install-newrelic.modal-title',
    );

    await expect(feedbackTitle).toContainText('Help us improve New Relic One');

    await page.getByRole('button', { name: 'Close modal' }).click();

    await page.getByTestId('install-newrelic.apm-footer-back-button').click();

    await page.getByTestId('install-newrelic.button-back-to-home').click();
  });

  test('should guide steps to install the PHP agent on host', async () => {
    test.slow();

    await page.getByTestId('install-newrelic.apm-tab').click();

    await page.getByTestId('install-newrelic.tile-php').click();

    await page
      .getByTestId('install-newrelic.button-begin-installation')
      .click();

    await page.waitForLoadState('networkidle');

    const phpOnHost = page.getByTestId('install-newrelic.php-on-host');

    await phpOnHost.click();

    const installationCommand = `curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh`;

    await expect(
      page.getByTestId('install-newrelic.code-snippet'),
    ).toContainText(installationCommand);

    const fireWallMessage = await page.locator(
      `div[data-test-id="install-newrelic.firewall-text"]`,
    );

    await expect(fireWallMessage).toContainText(
      'Using a firewall? Configure your proxy first.',
    );

    const paragraphElement = await page.locator(
      `div[data-test-id="install-newrelic.firewall-text"]`,
    );
    const linkElement = await paragraphElement.locator('a');

    const [networkTrafficDoc] = await Promise.all([
      page.waitForEvent('popup'),
      await linkElement.click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page.getByText('Network traffic').isVisible();

    await networkTrafficDoc.close();

    await page
      .getByTestId('install-newrelic.footer-action-php-agent-installer')
      .click();

    const addPHP = page.getByTestId('setup.heading');

    await expect(addPHP).toContainText('Add your PHP application data');

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

    const applicationNameContainer = await page.locator(
      'div[data-test-id="setup.naming-textfield"]',
    );

    const applicationNameInput = await applicationNameContainer.locator(
      'input[type="text"]',
    );

    await applicationNameInput.fill('testApp');

    const aptTitle = await page.locator('div[data-test-id="setup.apt"]');

    const aptRadio = await aptTitle.locator('input[type="radio"]');

    await aptRadio.check();

    const phpCommand = page.getByTestId('setup.install-php-agent-command');

    await expect(phpCommand).toContainText(
      `sudo apt-get -y install newrelic-php5`,
    );

    await page.getByTestId('setup.see-your-data-button').isEnabled();

    await expect(
      page.getByText(
        'Copy this command into your host to enable infrastructure and logs metrics.',
      ),
    ).toBeVisible();

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

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('setup.install-php-link').click(),
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
      page.getByTestId('setup.app-naming-link').click(),
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
      page.getByTestId('setup.distributed-tracing-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', { name: 'Introduction to distributed tracing' })
      .isVisible();

    await distributedTracingLink.close();

    const [compatibilityAndRequirementsDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('setup.compatibility-requirement-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'PHP agent compatibility and requirements',
      })
      .isVisible();

    await compatibilityAndRequirementsDoc.close();

    await page.getByTestId('platform.user-feedback-button').nth(1).click();

    await page
      .getByRole('heading', { name: 'Do you have specific feedback for us?' })
      .click();

    await page.getByRole('button', { name: 'Close modal' }).click();

    await page.getByTestId('platform.stacked-view-close-button').nth(1).click();

    await page
      .getByTestId('install-newrelic.footer-action-back-button')
      .click();

    await page.getByTestId('install-newrelic.button-back-to-home').click();
  });

  test('should guide steps to install the PHP agent On host standard', async () => {
    test.slow();

    await page.getByTestId('install-newrelic.apm-tab').click();

    await page.getByTestId('install-newrelic.tile-php').click();

    await page
      .getByTestId('install-newrelic.button-begin-installation')
      .click();

    const phpHostStandard = page.getByTestId(
      'install-newrelic.php-host-standard',
    );

    await phpHostStandard.click();

    const addPHP = page.getByTestId('setup.heading');

    await expect(addPHP).toContainText('Add your PHP application data');

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

    const applicationNameContainer = await page.locator(
      'div[data-test-id="setup.naming-textfield"]',
    );

    const applicationNameInput = await applicationNameContainer.locator(
      'input[type="text"]',
    );

    await applicationNameInput.fill('testApp');

    const aptTitle = await page.locator('div[data-test-id="setup.apt"]');

    const aptRadio = await aptTitle.locator('input[type="radio"]');

    await aptRadio.check();

    const phpCommand = page.getByTestId('setup.install-php-agent-command');

    await expect(phpCommand).toContainText(
      `sudo apt-get -y install newrelic-php5`,
    );

    await page.getByTestId('setup.see-your-data-button').isEnabled();

    await expect(
      page.getByText(
        'Copy this command into your host to enable infrastructure and logs metrics.',
      ),
    ).toBeVisible();

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

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('setup.install-php-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', { name: 'PHP agent installation overview' })
      .isVisible();

    await agentInstallationDoc.close();

    const [agentNamingDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('setup.app-naming-link').click(),
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
      page.getByTestId('setup.distributed-tracing-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', { name: 'Introduction to distributed tracing' })
      .isVisible();

    await distributedTracingLink.close();

    const [compatibilityAndRequirementsDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('setup.compatibility-requirement-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'PHP agent compatibility and requirements',
      })
      .isVisible();

    await compatibilityAndRequirementsDoc.close();

    await page.getByTestId('platform.user-feedback-button').nth(1).click();

    await page
      .getByRole('heading', { name: 'Do you have specific feedback for us?' })
      .click();

    await page.getByRole('button', { name: 'Close modal' }).click();

    await page.getByTestId('platform.stacked-view-close-button').nth(1).click();

    await page.getByTestId('install-newrelic.apm-footer-back-button').click();

    await page.getByTestId('install-newrelic.button-back-to-home').click();
  });

  test('should guide steps to install the PHP agent through Docker', async () => {
    test.slow();

    await page.getByTestId('install-newrelic.apm-tab').click();

    await page.getByTestId('install-newrelic.tile-php').click();

    await page
      .getByTestId('install-newrelic.button-begin-installation')
      .click();

    const phpDocker = page.getByTestId('install-newrelic.php-docker');

    await phpDocker.click();

    const addPHP = page.getByTestId('setup.heading');

    await expect(addPHP).toContainText('Add your PHP application data');

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

    const applicationNameContainer = await page.locator(
      'div[data-test-id="setup.naming-textfield"]',
    );

    const applicationNameInput = await applicationNameContainer.locator(
      'input[type="text"]',
    );

    await applicationNameInput.fill('testApp');

    const aptTitle = await page.locator('div[data-test-id="setup.apt"]');

    const aptRadio = await aptTitle.locator('input[type="radio"]');

    await aptRadio.check();

    const phpCommand = page.getByTestId('setup.install-php-agent-command');

    await expect(phpCommand).toContainText(
      `sudo apt-get -y install newrelic-php5`,
    );

    await page.getByTestId('setup.see-your-data-button').isEnabled();

    await expect(
      page.getByText(
        'Copy this command into your host to enable infrastructure and logs metrics.',
      ),
    ).toBeVisible();

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

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('setup.install-php-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', { name: 'Monitor your .NET app' })
      .isVisible();

    await agentInstallationDoc.close();

    const [agentNamingDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('setup.app-naming-link').click(),
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
      page.getByTestId('setup.distributed-tracing-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', { name: 'Introduction to distributed tracing' })
      .isVisible();

    await distributedTracingLink.close();

    const [compatibilityAndRequirementsDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('setup.compatibility-requirement-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'PHP agent compatibility and requirements',
      })
      .isVisible();

    await compatibilityAndRequirementsDoc.close();

    await page.getByTestId('platform.user-feedback-button').nth(1).click();

    await page
      .getByRole('heading', { name: 'Do you have specific feedback for us?' })
      .click();

    await page.getByRole('button', { name: 'Close modal' }).click();

    await page.getByTestId('platform.stacked-view-close-button').nth(1).click();

    await page.getByTestId('install-newrelic.apm-footer-back-button').click();

    await page.getByTestId('install-newrelic.button-back-to-home').click();
  });

  test('should guide steps to install the PHP agent through Package manager', async () => {
    test.slow();

    await page.getByTestId('install-newrelic.apm-tab').click();

    await page.getByTestId('install-newrelic.tile-php').click();

    await page
      .getByTestId('install-newrelic.button-begin-installation')
      .click();

    const packageManager = page.getByTestId(
      'install-newrelic.php-package-manager',
    );

    await packageManager.click();

    const addPHP = page.getByTestId('setup.heading');

    await expect(addPHP).toContainText('Add your PHP application data');

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

    const applicationNameContainer = await page.locator(
      'div[data-test-id="setup.naming-textfield"]',
    );

    const applicationNameInput = await applicationNameContainer.locator(
      'input[type="text"]',
    );

    await applicationNameInput.fill('testApp');

    const aptTitle = await page.locator('div[data-test-id="setup.apt"]');

    const aptRadio = await aptTitle.locator('input[type="radio"]');

    await aptRadio.check();

    const phpCommand = page.getByTestId('setup.install-php-agent-command');

    await expect(phpCommand).toContainText(
      `sudo apt-get -y install newrelic-php5`,
    );

    await page.getByTestId('setup.see-your-data-button').isEnabled();

    await expect(
      page.getByText(
        'Copy this command into your host to enable infrastructure and logs metrics.',
      ),
    ).toBeVisible();

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

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('setup.install-php-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', { name: 'Monitor your .NET app' })
      .isVisible();

    await agentInstallationDoc.close();

    const [agentNamingDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('setup.app-naming-link').click(),
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
      page.getByTestId('setup.distributed-tracing-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', { name: 'Introduction to distributed tracing' })
      .isVisible();

    await distributedTracingLink.close();

    const [compatibilityAndRequirementsDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByTestId('setup.compatibility-requirement-link').click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByRole('heading', {
        name: 'PHP agent compatibility and requirements',
      })
      .isVisible();

    await compatibilityAndRequirementsDoc.close();

    await page.getByTestId('platform.user-feedback-button').nth(1).click();

    await page
      .getByRole('heading', { name: 'Do you have specific feedback for us?' })
      .click();

    await page.getByRole('button', { name: 'Close modal' }).click();

    await page.getByTestId('platform.stacked-view-close-button').nth(1).click();

    await page.getByTestId('install-newrelic.apm-footer-back-button').click();

    await page.getByTestId('install-newrelic.button-back-to-home').click();
  });

  test('should guide steps to install the PHP agent through Hosting provider', async () => {
    test.slow();

    await page.getByTestId('install-newrelic.apm-tab').click();

    await page.getByTestId('install-newrelic.tile-php').click();

    await page
      .getByTestId('install-newrelic.button-begin-installation')
      .click();

    const [hostingProvider] = await Promise.all([
      page.waitForEvent('popup'),
      await page.getByTestId('install-newrelic.hosting-provider-doc').click(),
    ]);

    await hostingProvider.waitForLoadState('networkidle');

    await hostingProvider
      .getByRole('heading', {
        name: 'Install PHP with partnership accounts',
      })
      .isVisible();

    await hostingProvider.close();

    await page.getByTestId('install-newrelic.apm-footer-back-button').click();

    await page.getByTestId('install-newrelic.button-back-to-home').click();
  });
});

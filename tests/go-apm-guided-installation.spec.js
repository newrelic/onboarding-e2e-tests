import { test, getUrl, expect } from '@playwright/test';

let page

test.describe('Guided installation for Go', () => {
  test.beforeEach(async ({ browser }) => {
     const context = await browser.newContext ({storageState : "playwright/.auth/user.json"})
     page = await context.newPage();
     await page.goto('/nr1-core/install-newrelic/installation-plan?e2e-test&');
});
  test('should shows steps to install the Go agent', async ({ browser }) => {
    
    test.slow();

    await page.getByRole('heading', { name: 'Installation plan' }).isVisible();

    await page.getByText('APM (Application Monitoring)').click();

    await page.getByRole('radio', { name: 'Go' }).click();

    await page
      .getByRole('button', { name: 'Select your language (Go)' })
      .isVisible();

    await expect(page.getByText('Install the Go agent')).toBeVisible();

    await page.getByRole('button', { name: 'Begin installation' }).click();

    await expect(page.getByText('Add your Go application data')).toBeVisible();

    await page
      .getByRole('heading', { name: 'Give your application a name' })
      .isVisible();

    const [seeAppNamingDoc] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'See our docs on naming' }).click(),
    ]);

    await page.waitForLoadState('networkidle');

    await page
      .getByText('Name or change the name of your application')
      .isVisible();

    await seeAppNamingDoc.close();

    await page.getByRole('button', { name: 'See your data' }).isDisabled();

    await page.getByRole('textbox').fill('testApp');

    await page.getByRole('button', { name: 'See your data' }).isEnabled();

    await expect(
      page.getByText('Run this command to get the Go agent:'),
    ).toBeVisible();

    await expect(
      page.getByText(`go get github.com/newrelic/go-agent/v3`),
    ).toBeVisible();

    await expect(
      page.getByText(
        `In your application, import the package github.com/newrelic/go-agent/v3/newrelic.`,
      ),
    ).toBeVisible();

    await expect(
      page.getByText(`Add this code to your main function or init block:`),
    ).toBeVisible();

    /* NEED TO ADD data-test-id TO VALIDATE THE GO AGENT INITIALIZATION COMMAND */

    await expect(
      page.getByText(
        `To monitor web transactions, in your app code wrap standard HTTP requests. For example:`,
      ),
    ).toBeVisible();

    await expect(
      page.getByText(
        `http.HandleFunc(newrelic.WrapHandleFunc(app, "/users", usersHandler))`,
      ),
    ).toBeVisible();

    await expect(
      page.getByText(
        'Copy this command into your host to enable infrastructure and logs metrics.',
      ),
    ).toBeVisible();

    /* NEED TO DEFINE data-test-id FOR LINUX COMMAND SNIPPET */

    await page.getByRole('tab', { name: 'Windows' }).click();

    /* NEED TO DEFINE data-test-id FOR WINDOWS COMMAND SNIPPET */

    await page.getByRole('tab', { name: 'Docker' }).click();

    /* NEED TO DEFINE data-test-id FOR DOCKER COMMAND SNIPPET */

    // const [agentInstallationDoc] = await Promise.all([
    //   page.waitForEvent('popup'),
    //   page.getByRole('link', { name: 'Install the Go agent' }).click(),
    // ]);

    // await page.waitForLoadState('networkidle');

    // await page
    //   .getByRole('heading', { name: 'Install New Relic for Go' })
    //   .isVisible();

    // await agentInstallationDoc.close();

    // const [agentConfigDoc] = await Promise.all([
    //   page.waitForEvent('popup'),
    //   page.getByRole('link', { name: 'Go agent configuration' }).click(),
    // ]);

    // await page.waitForLoadState('networkidle');

    // await page
    //   .getByRole('heading', { name: 'Go agent configuration' })
    //   .isVisible();

    // await agentConfigDoc.close();

    // const [agentNamingDoc] = await Promise.all([
    //   page.waitForEvent('popup'),
    //   page.getByRole('link', { name: 'How to name your app' }).click(),
    // ]);

    // await page.waitForLoadState('networkidle');

    // await page
    //   .getByRole('heading', {
    //     name: 'Name or change the name of your application',
    //   })
    //   .isVisible();

    // await agentNamingDoc.close();

    // const [distributedTracingLink] = await Promise.all([
    //   page.waitForEvent('popup'),
    //   page.getByRole('link', { name: 'Distributed tracing' }).click(),
    // ]);

    // await page.waitForLoadState('networkidle');

    // await page
    //   .getByRole('heading', { name: 'Introduction to distributed tracing' })
    //   .isVisible();

    // await distributedTracingLink.close();

    // const [GoAgentLogsDoc] = await Promise.all([
    //   page.waitForEvent('popup'),
    //   page.getByRole('link', { name: 'Application logs in context' }).click(),
    // ]);

    // await page.waitForLoadState('networkidle');

    // await page
    //   .getByRole('heading', { name: 'Go agent logs in context' })
    //   .isVisible();

    // await GoAgentLogsDoc.close();

    // const [compatibilityDoc] = await Promise.all([
    //   page.waitForEvent('popup'),
    //   page
    //     .getByRole('link', { name: 'Compatibility and requirements' })
    //     .click(),
    // ]);

    // await page.waitForLoadState('networkidle');

    // await page
    //   .getByRole('heading', { name: 'Go agent compatibility and requirements' })
    //   .isVisible();

    // await compatibilityDoc.close();

    // const [agentLoggingConfigDoc] = await Promise.all([
    //   page.waitForEvent('popup'),
    //   page.getByRole('link', { name: 'Configure agent logging' }).click(),
    // ]);

    // await page.waitForLoadState('networkidle');

    // await page.getByRole('heading', { name: 'Go agent logging' }).isVisible();

    // await agentLoggingConfigDoc.close();

    /* open instrumentation doc is unavailable */
    // const [openInstrumentationDoc] = await Promise.all([
    //   page.waitForEvent('popup'),
    //   page.getByRole('link', { name: 'Open instrumentation' }).click(),
    // ]);

    // await page.waitForLoadState('networkidle');

    await page.getByTestId('platform.user-feedback-button').click();

    // await page
    //   .getByRole('heading', { name: 'Do you have specific feedback for us?' })
    //   .click();

    await page.getByRole('button', { name: 'Close modal' }).click();

    // await page.getByTestId('platform.stacked-view-close-button').click();

    // await page.getByRole('button', { name: 'Back' }).click();
  });
});

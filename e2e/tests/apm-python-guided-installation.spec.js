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
  await page.waitForLoadState();
  await page.goto("/nr1-core/install-newrelic/installation-plan?e2e-test&");
});

test.afterEach(async () => {
  await context.close();
});

test.afterAll(async () => {
  await browser.close();
});

test("should shows steps to install the Python", async () => {
  test.slow();

  await page.getByTestId("install-newrelic.apm-tab").click();

  await page.getByTestId("install-newrelic.tile-python").click();

  const selectEnvironmentHeading = await page.locator(
    `div[data-test-id="install-newrelic.steps-item"]`
  );

  await expect(selectEnvironmentHeading).toContainText(
    "Select your language (Python)"
  );

  const installPython = await page.getByTestId("install-newrelic.title");

  await expect(installPython).toContainText("Install the Python agent");

  await page.getByTestId("install-newrelic.button-begin-installation").click();

  await page.waitForLoadState("networkidle");

  const addPython = page.getByTestId("setup.heading");

  await expect(addPython).toContainText("Add your Python application data");

  // replace this with test id
  const [seeAppNamingDoc] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("link", { name: "See our docs on naming" }).click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page
    .getByText("Name or change the name of your application")
    .isVisible();

  await seeAppNamingDoc.close();

  const downloadConfigFileTitle = page.getByTestId("setup.download-file");

  await expect(downloadConfigFileTitle).toContainText(
    "Download your custom configuration file"
  );

  await page.getByTestId("setup.download-button").isDisabled();

  const warningText = page.getByTestId("setup.warning-text");

  await expect(warningText).toContainText("You must complete step 1");

  const applicationNameContainer = page.locator(
    'div[data-test-id="setup.naming-textfield"]'
  );

  const applicationNameInput =
    applicationNameContainer.locator('input[type="text"]');

  await applicationNameInput.fill("testApp");

  await expect(page.getByText("You must complete steps 1")).toBeHidden();

  await page.getByTestId("setup.download-button").isEnabled();

  const pipCommand = page.getByTestId("setup.install-pip-command");

  await expect(pipCommand).toContainText(`pip install newrelic`);

  const startApplication = `Use the following script command before your usual startup options to start your application and start sending your data to New Relic. Replace $YOUR_COMMAND_OPTIONS below with your app’s command line, eg. python app.py.`;

  // replace this with test id
  await expect(page.getByText(startApplication)).toBeVisible();

  const applicationCommand = page.getByTestId(
    "setup.start-application-command"
  );

  await expect(applicationCommand).toContainText(
    `NEW_RELIC_CONFIG_FILE=newrelic.ini newrelic-admin run-program $YOUR_COMMAND_OPTIONS`
  );

  // replace this with test id
  await expect(
    page.getByText(
      "Copy this command into your host to enable infrastructure and logs metrics."
    )
  ).toBeVisible();

  await expect(page.getByTestId("setup.agent-commands")).toContainText(
    `NEW_RELIC_ACCOUNT_ID=`
  );

  await expect(page.getByTestId("setup.agent-commands")).toContainText(
    `curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh`
  );

  const tabItems = await page.locator(`button[data-test-id="setup.tabs"]`);

  await tabItems.nth(1).click();

  await expect(page.getByTestId("setup.agent-commands")).toContainText(
    `$env:NEW_RELIC_REGION=`
  );

  await tabItems.nth(2).click();

  await expect(page.getByTestId("setup.agent-commands")).toContainText(
    `NRIA_LICENSE_KEY=`
  );

  const [pythonInstallationDoc] = await Promise.all([
    page.waitForEvent("popup"),
    await page.getByTestId("setup.install-python-link").click(),
  ]);

  await page.waitForLoadState("networkidle");

  await pythonInstallationDoc
    .getByRole("heading", {
      name: "Install the Python agent",
    })
    .click();

  await pythonInstallationDoc.close();

  const [pythonInstallationOnDockerDoc] = await Promise.all([
    page.waitForEvent("popup"),
    await page.getByTestId("setup.install-docker-link").click(),
  ]);

  await page.waitForLoadState("networkidle");

  await pythonInstallationOnDockerDoc
    .getByRole("heading", {
      name: "Install the Python agent",
    })
    .click();

  await pythonInstallationOnDockerDoc.close();

  const [appNamingDoc] = await Promise.all([
    page.waitForEvent("popup"),
    await page.getByTestId("setup.app-naming-link").click(),
  ]);

  await page.waitForLoadState("networkidle");

  await appNamingDoc
    .getByRole("heading", {
      name: "Name or change the name of your application",
    })
    .click();

  await appNamingDoc.close();

  const [distributedTracingLink] = await Promise.all([
    page.waitForEvent("popup"),
    await page.getByTestId("setup.distributed-tracing-link").click(),
  ]);

  await distributedTracingLink
    .getByRole("heading", {
      name: "Introduction to distributed tracing",
    })
    .click();

  await distributedTracingLink.close();

  const [compatibilityDoc] = await Promise.all([
    page.waitForEvent("popup"),
    await page.getByTestId("setup.compatibility-requirement-link").click(),
  ]);

  await compatibilityDoc
    .getByRole("heading", {
      name: "Compatibility and requirements for the Python agent",
    })
    .click();

  await compatibilityDoc.close();

  await page.getByTestId("platform.user-feedback-button").click();

  // replace this with test id
  await page
    .getByRole("heading", { name: "Do you have specific feedback for us?" })
    .click();

  // replace this with test id
  await page.getByRole("button", { name: "Close modal" }).click();

  await page.getByTestId("platform.stacked-view-close-button").click();

  await page.getByTestId("install-newrelic.button-back-to-home").click();
});

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

  await page.getByText("APM (Application Monitoring)").click();

  await page.getByTestId("install-newrelic.tile-python").click();

  await expect(page.getByText("Select your language (Python)")).toBeVisible();

  await expect(page.getByText("Install the Python agent")).toBeVisible();

  await page.getByTestId("install-newrelic.button-begin-installation").click();

  await page.waitForLoadState("networkidle");

  await expect(
    page.getByText("Add your Python application data")
  ).toBeVisible();

  const [seeAppNamingDoc] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("link", { name: "See our docs on naming" }).click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page
    .getByText("Name or change the name of your application")
    .isVisible();

  await seeAppNamingDoc.close();

  await expect(
    page.getByText("Download your custom configuration file")
  ).toBeVisible();

  await page.getByTestId("setup.download-button").isDisabled();

  await expect(page.getByText("You must complete step 1")).toBeVisible();

  const applicationNameContainer = await page.locator(
    'div[data-test-id="setup.naming-textfield"]'
  );

  const applicationNameInput = await applicationNameContainer.locator(
    'input[type="text"]'
  );

  await applicationNameInput.fill("testApp");

  await expect(page.getByText("You must complete steps 1")).toBeHidden();

  await page.getByTestId("setup.download-button").isEnabled();

  await expect(
    page.getByText(
      "For each application you want to monitor, install the agent with pip. If your app runs in a virtualenv, activate it first:"
    )
  ).toBeVisible();

  await expect(page.getByText("pip install newrelic")).toBeVisible();

  const startApplication = `Use the following script command before your usual startup options to start your application and start sending your data to New Relic. Replace $YOUR_COMMAND_OPTIONS below with your app’s command line, eg. python app.py.`;

  await expect(page.getByText(startApplication)).toBeVisible();

  await expect(
    page.getByText(
      `NEW_RELIC_CONFIG_FILE=newrelic.ini newrelic-admin run-program $YOUR_COMMAND_OPTIONS`
    )
  ).toBeVisible();

  await expect(
    page.getByText(
      "Copy this command into your host to enable infrastructure and logs metrics."
    )
  ).toBeVisible();

  /* NEED TO DEFINE data-test-id FOR LINUX COMMAND SNIPPET */

  await page.getByRole("tab", { name: "Windows" }).click();

  /* NEED TO DEFINE data-test-id FOR WINDOWS COMMAND SNIPPET */

  await page.getByRole("tab", { name: "Docker" }).click();

  /* NEED TO DEFINE data-test-id FOR DOCKER COMMAND SNIPPET */

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

  await page
    .getByRole("heading", { name: "Do you have specific feedback for us?" })
    .click();

  await page.getByRole("button", { name: "Close modal" }).click();

  await page.getByTestId("platform.stacked-view-close-button").click();

  await page.getByTestId("install-newrelic.button-back-to-home").click();
});

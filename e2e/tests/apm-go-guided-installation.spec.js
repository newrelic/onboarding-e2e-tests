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

test("should shows steps to install the Go agent", async () => {
  test.slow();

  await page.getByText("APM (Application Monitoring)").click();

  await page.getByTestId("install-newrelic.tile-go").click();

  await expect(page.getByText("Select your language (Go)")).toBeVisible();

  await expect(page.getByText("Install the Go agent")).toBeVisible();

  await page.getByTestId("install-newrelic.button-begin-installation").click();

  await expect(page.getByText("Add your Go application data")).toBeVisible();

  await page
    .getByRole("heading", { name: "Give your application a name" })
    .isVisible();

  const [seeAppNamingDoc] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("link", { name: "See our docs on naming" }).click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page
    .getByText("Name or change the name of your application")
    .isVisible();

  await seeAppNamingDoc.close();

  await page.getByTestId("setup.see-your-data-button").isDisabled();

  const applicationNameContainer = await page.locator(
    'div[data-test-id="setup.naming-textfield"]'
  );

  const applicationNameInput = await applicationNameContainer.locator(
    'input[type="text"]'
  );

  await applicationNameInput.fill("testApp");

  await page.getByTestId("setup.see-your-data-button").isEnabled();

  await expect(
    page.getByText("Run this command to get the Go agent:")
  ).toBeVisible();

  await expect(
    page.getByText(`go get github.com/newrelic/go-agent/v3`)
  ).toBeVisible();

  await expect(
    page.getByText(
      `In your application, import the package github.com/newrelic/go-agent/v3/newrelic.`
    )
  ).toBeVisible();

  await expect(
    page.getByText(`Add this code to your main function or init block:`)
  ).toBeVisible();

  /* NEED TO ADD data-test-id TO VALIDATE THE GO AGENT INITIALIZATION COMMAND */

  await expect(
    page.getByText(
      `To monitor web transactions, in your app code wrap standard HTTP requests. For example:`
    )
  ).toBeVisible();

  await expect(
    page.getByText(
      `http.HandleFunc(newrelic.WrapHandleFunc(app, "/users", usersHandler))`
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

  const [agentInstallationDoc] = await Promise.all([
    page.waitForEvent("popup"),
    await page.getByTestId("setup.install-go-link").click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page
    .getByRole("heading", { name: "Install New Relic for Go" })
    .isVisible();

  await agentInstallationDoc.close();

  const [agentConfigDoc] = await Promise.all([
    page.waitForEvent("popup"),
    await page.getByTestId("setup.go-config-link").click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page
    .getByRole("heading", { name: "Go agent configuration" })
    .isVisible();

  await agentConfigDoc.close();

  const [agentNamingDoc] = await Promise.all([
    page.waitForEvent("popup"),
    await page.getByTestId("setup.app-naming-link").click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page
    .getByRole("heading", {
      name: "Name or change the name of your application",
    })
    .isVisible();

  await agentNamingDoc.close();

  const [distributedTracingLink] = await Promise.all([
    page.waitForEvent("popup"),
    await page.getByTestId("setup.distributed-tracing-link").click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page
    .getByRole("heading", { name: "Introduction to distributed tracing" })
    .isVisible();

  await distributedTracingLink.close();

  const [GoAgentLogsDoc] = await Promise.all([
    page.waitForEvent("popup"),
    await page.getByTestId("setup.application-logs-link").click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page
    .getByRole("heading", { name: "Go agent logs in context" })
    .isVisible();

  await GoAgentLogsDoc.close();

  const [compatibilityDoc] = await Promise.all([
    page.waitForEvent("popup"),
    await page.getByTestId("setup.compatibility-requirement-link").click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page
    .getByRole("heading", { name: "Go agent compatibility and requirements" })
    .isVisible();

  await compatibilityDoc.close();

  const [agentLoggingConfigDoc] = await Promise.all([
    page.waitForEvent("popup"),
    await page.getByTestId("setup.configure-agent-link").click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page.getByRole("heading", { name: "Go agent logging" }).isVisible();

  await agentLoggingConfigDoc.close();

  await page.waitForLoadState("networkidle");

  await page.getByTestId('platform.user-feedback-button').click();

  await page
    .getByRole('heading', { name: 'Do you have specific feedback for us?' })
    .click();

  await page.getByRole('button', { name: 'Close modal' }).click();

  await page.getByTestId('platform.stacked-view-close-button').click();

  await page.getByTestId('install-newrelic.button-back-to-home').click();
});

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

test("should guide on steps to install Docker", async () => {
  test.slow();

  await page.getByTestId("install-newrelic.tile-docker").click();

  const selectEnvironmentHeading = await page.locator(
    `div[data-test-id="install-newrelic.steps-item"]`
  );

  await expect(selectEnvironmentHeading).toContainText(
    "Select your environment (Docker)"
  );

  await page.getByTestId("install-newrelic.button-begin-installation").click();

  await page.waitForLoadState("networkidle");

  const dockerText = await page.getByTestId("install-newrelic.docker-text");

  await expect(dockerText).toContainText(
    "The New Relic infrastructure agent monitors Docker on your host automatically."
  );

  const dockerCodeSnippet = page.locator(
    "data-test-id=install-newrelic.code-snippet"
  );

  await expect(dockerCodeSnippet).toContainText("NRIA_LICENSE_KEY=");

  const [footerSeeOurDocs] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByTestId("install-newrelic.docs-link").click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page
    .getByRole("heading", { name: "Guided install overview" })
    .isVisible();

  await footerSeeOurDocs.close();

  await page.getByTestId("install-newrelic.feedback-link").click();

  const feedbackTitle = await page.getByTestId("install-newrelic.modal-title");

  await expect(feedbackTitle).toContainText("Help us improve New Relic One");

  // replace this with test id
  await page.getByRole("button", { name: "Close modal" }).click();

  await page.getByTestId("install-newrelic.footer-action-back-button").click();

  await page.getByTestId("install-newrelic.button-back-to-home").click();
});

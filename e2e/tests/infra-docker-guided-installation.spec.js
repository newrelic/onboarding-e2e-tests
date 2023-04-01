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

  await page
    .getByRole("button", { name: "Select your environment (Docker)" })
    .isVisible();

  await page.getByTestId("install-newrelic.button-begin-installation").click();

  await page.waitForLoadState("networkidle");

  await expect(
    page.getByText(
      "The New Relic infrastructure agent monitors Docker on your host automatically."
    )
  ).toBeVisible();

  await expect(page.getByTestId("install-newrelic.code-snippet")).toContainText(
    " -e NRIA_LICENSE_KEY"
  );

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

  await expect(page.getByText("Help us improve New Relic One")).toBeVisible();

  await page.getByRole("button", { name: "Close modal" }).click();

  await page.getByTestId("install-newrelic.footer-action-back-button").click();

  await page.getByTestId("install-newrelic.button-back-to-home").click();
});

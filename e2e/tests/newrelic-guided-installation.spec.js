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

test.describe("New Relic Guided installation agents", () => {
  test("should validate default Auto-discovery guided installations", async () => {
    await page
      .getByRole("heading", { name: "Select your environment" })
      .isVisible();
    await page.getByTestId("install-newrelic.tile-linux").isVisible();
    await page.getByTestId("install-newrelic.tile-windows").isVisible();
    await page.getByTestId("install-newrelic.tile-docker").isVisible();
    await page.getByTestId("install-newrelic.tile-kubernetes").isVisible();
    await page.getByTestId("install-newrelic.tile-macos").isVisible();
  });

  test("should validate default APM guided installations", async () => {
   
    await page.getByText("APM (Application Monitoring)").click();
    await page
      .getByRole("heading", { name: "Select your language" })
      .isVisible();
    await page.getByTestId("install-newrelic.tile-java").isVisible();
    await page.getByTestId("install-newrelic.tile-dotnet").isVisible();
    await page.getByTestId("install-newrelic.tile-php").isVisible();
    await page.getByTestId("install-newrelic.tile-nodejs").isVisible();
    await page.getByTestId("install-newrelic.tile-ruby").isVisible();
    await page.getByTestId("install-newrelic.tile-python").isVisible();
    await page.getByTestId("install-newrelic.tile-go").isVisible();
    //await page.getByRole('heading', { name: 'Auto-telemetry' }).isVisible();
    await page.getByTestId("install-newrelic.tile-kubernetes").isVisible();
  });
});

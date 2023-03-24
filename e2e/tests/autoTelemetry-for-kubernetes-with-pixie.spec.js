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

test("should show steps to install auto-telemetry for Kubernetes with pixie", async () => {
  test.slow();

  await page.getByText("APM (Application Monitoring)").click();

  await page.getByRole("radio", { name: "Auto-telemetry" }).click();

  await page
    .getByRole("button", { name: "Select your environment (Kubernetes)" })
    .isVisible();

  await expect(
    page.getByText("Install the New Relic Kubernetes integration with Pixie")
  ).toBeVisible();

  await page.getByRole("button", { name: "Begin installation" }).click();

  await page.getByRole("button", { name: "Continue" }).isDisabled();

  await page.getByLabel("Cluster name").fill("TestCluster");

  await page.getByRole("button", { name: "Continue" }).isEnabled();

  await page.getByRole("button", { name: "Continue" }).click();

  await expect(
    page.getByText("Select the additional data you want to gather")
  ).toBeVisible();

  // /* need to define test-id */
  // expect(await page.locator("#checkbox-0").isChecked()).toBeTruthy();
  // /* need to define test-id */
  // expect(await page.locator("#checkbox-3").isChecked()).toBeTruthy();
  // /* need to define test-id */
  // expect(await page.locator("#checkbox-5").isChecked()).toBeTruthy();

  // check entered cluster name
  await expect(page.getByText("TestCluster")).toBeVisible();

  await page.getByRole("button", { name: "Continue" }).click();

  await expect(
    page.getByText(
      "To allow data through your firewall, set the HTTPS_PROXY environment variable to your proxy’s URL before you run the command below."
    )
  ).toBeVisible();

  await expect(page.getByTestId("install-newrelic.code-snippet")).toContainText(
    `NR_CLI_CLUSTERNAME=TestCluster NR_CLI_NAMESPACE=newrelic`
  );

  await page.getByRole("tab", { name: "Helm 3" }).click();

  await expect(page.getByTestId("install-newrelic.code-snippet")).toContainText(
    `helm repo add newrelic https://helm-charts.newrelic.com && helm repo update `
  );

  await page.getByRole("tab", { name: "Manifest" }).click();

  await expect(page.getByTestId("install-newrelic.code-snippet")).toContainText(
    `"pixie-chart.clusterName":"TestCluster"`
  );

  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText("Listening for data")).toBeVisible();

  await expect(
    page.getByText("Pixie: get ready for next-gen K8s observability!")
  ).toBeVisible();

  await page.getByRole("button", { name: "Back" }).click();

  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Back" }).click();

  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Back" }).click();

  const [docsLink] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("link", { name: "See our docs" }).click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page
    .getByRole("heading", {
      name: "Introduction to the Kubernetes integration",
    })
    .isVisible();

  await docsLink.close();

  await page.getByText("Give feedback").click();

  await expect(page.getByText("Help us improve New Relic One")).toBeVisible();

  await page.getByRole("button", { name: "Close modal" }).click();

});

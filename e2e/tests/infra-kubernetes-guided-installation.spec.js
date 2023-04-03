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

test("should show steps to install Kubernetes", async () => {
  test.slow();

  await page.getByTestId("install-newrelic.tile-kubernetes").click();

  await page
    .getByRole("button", { name: "Select your environment (Kubernetes)" })
    .isVisible();

  await page.getByTestId("install-newrelic.button-begin-installation").click();

  await page.waitForLoadState("networkidle");

  await expect(
    page.getByText("Configure the Kubernetes integration")
  ).toBeVisible();

  await page
    .getByTestId("install-newrelic.footer-action-continue-button")
    .isDisabled();

  const clusterNameContainer = await page.locator(
    'div[data-test-id="install-newrelic.cluster-textfield"]'
  );

  const clusterNameTextField = await clusterNameContainer.locator(
    'input[type="text"]'
  );

  await clusterNameTextField.fill("TestCluster");

  await page
    .getByTestId("install-newrelic.footer-action-continue-button")
    .isEnabled();

  await page
    .getByTestId("install-newrelic.footer-action-continue-button")
    .click();

  await page.waitForLoadState("networkidle");

  await expect(
    page.getByText("Select the additional data you want to gather")
  ).toBeVisible();

  /* 
  
  SINCE UPDATES ARE HAPPENING ON KUBERNETES, CHECKBOXES HAVE BEEN COMMENTED 
  
  expect(await page.locator('#checkbox-0').isChecked()).toBeTruthy();

  expect(await page.locator('#checkbox-3').isChecked()).toBeTruthy();

  expect(await page.locator('#checkbox-5').isChecked()).toBeTruthy();

  */

  await page
    .getByTestId("install-newrelic.additional-data-continue-button")
    .click();

  await page.waitForLoadState("networkidle");

  await expect(page.getByText("Choose install method")).toBeVisible();

  await expect(
    page.getByText("Guided install uses Helm by default")
  ).toBeVisible();

  const codeSnippet = page.locator(
    "data-test-id=install-newrelic.code-snippet"
  );

  await expect(codeSnippet).toContainText("NR_CLI_CLUSTERNAME=TestCluster");

  // await page.locator("[id='tab-helm3-id-3']").click();

  await page.getByRole("tab", { name: "Helm 3" }).click();

  await expect(codeSnippet).toContainText(
    "helm repo add newrelic https://helm-charts.newrelic.com && helm repo update"
  );

  await page.getByRole("tab", { name: "Manifest" }).click();

  await expect(codeSnippet).toContainText(
    `"pixie-chart.clusterName":"TestCluster"`
  );

  await page
    .getByTestId("install-newrelic.install-methods-continue-button")
    .click();

  await expect(page.getByText("Listening for data")).toBeVisible();

  await expect(
    page.getByText("Pixie: get ready for next-gen K8s observability!")
  ).toBeVisible();

  await page.getByTestId("install-newrelic.lastpage-back-button").click();

  await page
    .getByTestId("install-newrelic.install-methods-back-button")
    .click();

  await page
    .getByTestId("install-newrelic.additional-data-back-button")
    .click();

  const [footerSeeOurDocs] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByTestId("install-newrelic.docs-link").click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page
    .getByRole("heading", {
      name: "Introduction to the Kubernetes integration",
    })
    .isVisible();

  await footerSeeOurDocs.close();

  await page.getByTestId("install-newrelic.feedback-link").click();

  await expect(page.getByText("Help us improve New Relic One")).toBeVisible();

  await page.getByRole("button", { name: "Close modal" }).click();

  await page.getByTestId("install-newrelic.footer-action-back-button").click();

  await page.getByTestId("install-newrelic.button-back-to-home").click();
});

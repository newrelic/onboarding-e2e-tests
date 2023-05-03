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

  await page.getByTestId("install-newrelic.apm-tab").click();

  await page.getByTestId("install-newrelic.tile-kubernetes").click();

  const selectLanguageHeading = await page.locator(
    `div[data-test-id="install-newrelic.steps-item"]`
  );

  await expect(selectLanguageHeading).toContainText(
    "Select your language (Kubernetes)"
  );

  const installationTitle = await page.getByTestId("install-newrelic.title");

  await expect(installationTitle).toContainText(
    "Install the New Relic Kubernetes integration with Pixie"
  );

  await page.getByTestId("install-newrelic.button-begin-installation").click();

  await page.waitForLoadState("networkidle");

  // Set the timeout to 10 seconds
  await page.setDefaultNavigationTimeout(10000);

  await expect(
    page.getByTestId("install-newrelic.pixie-description")
  ).toContainText(
    `Get instant service-level insights, full-body requests, and application profiles through eBPF.`
  );

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

  const feedbackTitle = await page.getByTestId("install-newrelic.modal-title");

  await expect(feedbackTitle).toContainText("Help us improve New Relic One");

  await page.getByRole("button", { name: "Close modal" }).click();

  await page
    .getByTestId("install-newrelic.footer-action-continue-button")
    .isDisabled();

  const clusterNameContainer = await page.locator(
    'div[data-test-id="install-newrelic.cluster-textfield"]'
  );

  const clusterNameInput = await clusterNameContainer.locator(
    'input[type="text"]'
  );

  await clusterNameInput.fill("TestCluster");

  await page
    .getByTestId("install-newrelic.footer-action-continue-button")
    .isEnabled();

  await page
    .getByTestId("install-newrelic.footer-action-continue-button")
    .click();

  await page.waitForLoadState("networkidle");

  const additionalData = await page.getByTestId(
    "install-newrelic.gather-additional-data"
  );

  await expect(additionalData).toContainText(
    "Select the additional data you want to gather"
  );

  await page
    .getByTestId("install-newrelic.additional-data-continue-button")
    .click();

  await page.waitForLoadState("networkidle");

  const installationMethods = await page.getByTestId(
    "install-newrelic.installation-methods"
  );

  await expect(installationMethods).toContainText("Choose install method");

  const defaultHelmUse = await page.locator(
    `div[data-test-id="install-newrelic.helm-heading"]`
  );

  await expect(defaultHelmUse).toContainText(
    "Guided install uses Helm by default"
  );

  const codeSnippet = page.locator(
    "data-test-id=install-newrelic.code-snippet"
  );

  await expect(codeSnippet).toContainText("NR_CLI_CLUSTERNAME=TestCluster");

  await page.getByTestId("install-newrelic.tab-helm-3").click();

  await expect(codeSnippet).toContainText(
    "helm repo add newrelic https://helm-charts.newrelic.com && helm repo update"
  );

  await page.getByTestId("install-newrelic.tab-manifest").click();

  await expect(codeSnippet).toContainText(
    `"pixie-chart.clusterName":"TestCluster"`
  );

  await page
    .getByTestId("install-newrelic.install-methods-continue-button")
    .click();

  const listenData = await page.getByTestId("install-newrelic.listen-data");

  await expect(listenData).toContainText("Listening for data");

  const pixieHeading = await page.getByTestId("install-newrelic.pixie-heading");

  await expect(pixieHeading).toContainText(
    "Pixie: get ready for next-gen K8s observability!"
  );

  await page.getByTestId("install-newrelic.lastpage-back-button").click();

  await page
    .getByTestId("install-newrelic.install-methods-back-button")
    .click();

  await page
    .getByTestId("install-newrelic.additional-data-back-button")
    .click();

  await page.getByTestId("install-newrelic.footer-action-back-button").click();

  await page.getByTestId("install-newrelic.button-back-to-home").click();
});

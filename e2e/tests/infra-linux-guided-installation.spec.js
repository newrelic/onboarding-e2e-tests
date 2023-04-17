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

test("should guide on steps to install Linux", async () => {
  test.slow();

  await page.getByTestId("install-newrelic.tile-linux").click();

  const selectEnvironmentHeading = await page.locator(
    "data-test-id=install-newrelic.steps-item"
  );

  await expect(selectEnvironmentHeading).toContainText(
    "Select your environment (Linux)"
  );

  await page.getByTestId("install-newrelic.button-begin-installation").click();
  
  await page.waitForLoadState('networkidle');

  await page.getByTestId("install-newrelic.customization-button").click();

  const linuxCodeSnippet = page.locator(
    "data-test-id=install-newrelic.code-snippet"
  );

  await expect(linuxCodeSnippet).toContainText("sudo NEW_RELIC_API_KEY=NRAK");

  const customizationCLIOption = await page.locator(
    'div[data-test-id="install-newrelic.cli-checkbox"]'
  );

  const customizationCLICheckbox = await customizationCLIOption.locator(
    'input[type="checkbox"]'
  );

  await customizationCLICheckbox.isChecked();

  await customizationCLICheckbox.isDisabled();

  const customizationPromptOption = await page.locator(
    'div[data-test-id="install-newrelic.prompt-checkbox"]'
  );

  await customizationPromptOption.locator('input[type="checkbox"]').check();

  await expect(linuxCodeSnippet).toContainText("-y");

  const customizationProxyOption = await page.locator(
    'div[data-test-id="install-newrelic.proxy-checkbox"]'
  );

  await customizationProxyOption.locator('input[type="checkbox"]').check();

  const customizationProxyInput = await page.locator(
    'div[data-test-id="install-newrelic.proxy-input"]'
  );

  await expect(customizationProxyInput).toContainText("Enter proxy URL");

  const proxyTextField = await customizationProxyInput.locator(
    'input[type="text"]'
  );

  await proxyTextField.fill("randomText");

  await expect(customizationProxyInput).toContainText("Invalid URL");

  await proxyTextField.fill("");

  await proxyTextField.fill("http://test-proxy:8080");

  await expect(linuxCodeSnippet).toContainText(
    "HTTPS_PROXY=http://test-proxy:8080"
  );

  await customizationProxyOption.locator('input[type="checkbox"]').uncheck();

  const customizationTags = await page.locator(
    'div[data-test-id="install-newrelic.tag-input"]'
  );

  const tagInput = await customizationTags.locator('input[type="text"]');

  await tagInput.fill("randomText");

  await tagInput.press("Enter");

  await expect(customizationTags).toContainText(
    "Tag contains invalid character"
  );

  await tagInput.fill("");

  await tagInput.fill("Test:5");

  await tagInput.press("Enter");

  await expect(linuxCodeSnippet).toContainText("--tag Test:5");

  const accessPointsInfo = await page.locator(
    `div[data-test-id="install-newrelic.network-traffic-doc"]`
  );

  const useProxy = await accessPointsInfo.locator("button");

  await useProxy.click();

  await customizationProxyOption.locator('input[type="checkbox"]').isChecked();

  await expect(customizationProxyInput).toContainText("Enter proxy URL");

  const networkTrafficDoc = await accessPointsInfo.locator("a");

  const [docsLink] = await Promise.all([
    page.waitForEvent("popup"),
    await networkTrafficDoc.click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page.getByRole("heading", { name: "Network traffic" }).isVisible();

  await docsLink.close();

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

  //replace this with test id
  await page.getByRole("button", { name: "Close modal" }).click();

  await page.getByTestId("install-newrelic.footer-action-back-button").click();

  await page.getByTestId("install-newrelic.button-back-to-home").click();
});

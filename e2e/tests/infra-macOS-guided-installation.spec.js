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

test("should guide on steps to install macOS", async () => {
  test.slow();

  await page.getByTestId("install-newrelic.tile-macos").click();

  await page
    .getByRole("button", { name: "Select your environment (macOS)" })
    .isVisible();

  await page.getByTestId("install-newrelic.button-begin-installation").click();

  await page.waitForLoadState("networkidle");

  // const homeBrewInfoInstallationInfo =
  //   "Homebrew must be installed to run this installation.This command only supports installing the New Relic Infrastructure Agent. You will not be able to instrument on host integrations or collect logs.";

  // await expect(
  //   page.getByTestId("install-newrelic.homebrew-docs")
  // ).toContainText(homeBrewInfoInstallationInfo);

  // await expect(page.getByText(homeBrewInfoInstallationInfo)).toBeVisible();

  const homebrewInstallationDoc = await page.locator(
    `div[data-test-id="install-newrelic.homebrew-docs"]`
  );
  const installationDoc = await homebrewInstallationDoc.locator("a");

  const [homebrewDocsLink] = await Promise.all([
    page.waitForEvent("popup"),
    await installationDoc.click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page.getByRole("heading", { name: "Homebrew" }).isVisible();

  await homebrewDocsLink.close();

  await page
    .getByRole("button", { name: "Customize your installation" })
    .click();

  const macOSCodeSnippet = page.locator(
    "data-test-id=install-newrelic.code-snippet"
  );

  await expect(macOSCodeSnippet).toContainText(" sudo NEW_RELIC_API_KEY=NRAK");

  const customizationCLIOption = await page.locator(
    'div[data-test-id="install-newrelic.cli-checkbox"]'
  );

  const customizationCLICheckbox = await customizationCLIOption.locator(
    'input[type="checkbox"]'
  );

  await customizationCLICheckbox.isChecked();

  await customizationCLICheckbox.isDisabled();

  const customizationProxyOption = await page.locator(
    'div[data-test-id="install-newrelic.proxy-checkbox"]'
  );

  await customizationProxyOption.locator('input[type="checkbox"]').check();

  await page.getByRole("div", { name: "Enter proxy URL" }).isVisible();

  const customizationProxyInput = await page.locator(
    'div[data-test-id="install-newrelic.proxy-input"]'
  );

  const proxyTextField = await customizationProxyInput.locator(
    'input[type="text"]'
  );

  await proxyTextField.fill("randomText");

  await expect(page.getByText("Invalid URL")).toBeVisible();

  //clear the text field
  await proxyTextField.fill("");

  await proxyTextField.fill("http://test-proxy:8080");

  await expect(macOSCodeSnippet).toContainText(
    "HTTPS_PROXY=http://test-proxy:8080"
  );

  await customizationProxyOption.locator('input[type="checkbox"]').uncheck();

  const customizationTags = await page.locator(
    'div[data-test-id="install-newrelic.tag-input"]'
  );

  const tagInput = await customizationTags.locator('input[type="text"]');

  await tagInput.fill("randomText");

  await tagInput.press("Enter");

  await expect(page.getByText("Tag contains invalid character")).toBeVisible();

  await tagInput.fill("");

  await tagInput.fill("Test:5");

  await tagInput.press("Enter");

  await expect(page.getByText("Tag contains invalid character")).toBeHidden();

  await expect(macOSCodeSnippet).toContainText("--tag Test:5");

  const accessPointsInfo = await page.locator(
    `div[data-test-id="install-newrelic.network-traffic-doc"]`
  );
  const networkTrafficDoc = await accessPointsInfo.locator("a");

  const [docsLink] = await Promise.all([
    page.waitForEvent("popup"),
    await networkTrafficDoc.click(),
  ]);

  await page.waitForLoadState("networkidle");

  await page.getByRole("heading", { name: "Network traffic" }).isVisible();

  await docsLink.close();

  await page.getByRole("button", { name: "Use a proxy" }).click();

  await customizationProxyOption.locator('input[type="checkbox"]').isChecked();

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

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

  test("should shows steps to install the Ruby", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByTestId("install-newrelic.tile-ruby").click();

    await expect(page.getByText("Select your language (Ruby)")).toBeVisible();

    await expect(page.getByText("Install the Ruby agent")).toBeVisible();

    await page.getByRole("button", { name: "Begin installation" }).click();

    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText("Add your Ruby application data")
    ).toBeVisible();

    await expect(
      page.getByText(
        "Install the APM Ruby agent to monitor your Ruby application. Follow these steps to get your data into New Relic."
      )
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

    await page.getByRole("button", { name: "Download" }).isDisabled();

    await expect(
      page.getByText("You must complete steps  1, and 2")
    ).toBeVisible();

    await page.getByRole("textbox").fill("testApp");

    await expect(
      page.getByText("You must complete steps  1, and 2")
    ).toBeHidden();

    await page.getByRole("button", { name: "Download" }).isDisabled();

    await expect(page.getByText("You must complete step 2")).toBeVisible();

    await page
      .getByRole("heading", { name: "Are you using Bundler?" })
      .isVisible();

    await page.getByLabel("Yes, I’m using Bundler").check();

    await page.getByRole("button", { name: "Download" }).isEnabled();

    await expect(page.getByText("You must complete step 2")).toBeHidden();

    await expect(
      page.getByText("Add the agent gem to your Gemfile:")
    ).toBeVisible();

    await expect(page.getByText("gem 'newrelic_rpm'")).toBeVisible();

    await expect(
      page.getByText("Make sure it gets added to your Bundle Gemfile:")
    ).toBeVisible();

    await expect(page.getByText("bundle install")).toBeVisible();

    await page.getByLabel("No, I'm not using Bundler").check();

    await expect(page.getByText("Install the agent using gem")).toBeVisible();

    await expect(page.getByText("gem install newrelic_rpm")).toBeVisible();

    await expect(
      page.getByText("Under your application’s require directive, add:")
    ).toBeVisible();

    await expect(page.getByText("require 'newrelic_rpm'")).toBeVisible();

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

    const [rubyInstallationDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "Install the Ruby agent" }).click(),
    ]);

    await page.waitForLoadState("networkidle");

    await rubyInstallationDoc
      .getByRole("heading", {
        name: "Install the New Relic Ruby agent",
      })
      .click();

    await rubyInstallationDoc.close();

    const [appNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "See our docs on naming" }).click(),
    ]);

    // await appNamingDoc.waitForTimeout(5000);

    // expect(await page.screenshot()).toMatchSnapshot("app-naming.png");

    await appNamingDoc.close();

    const [distributedTracingLink] = await Promise.all([
      page.waitForEvent("popup"),
      page
        .getByRole("link", { name: "Introduction to distributed tracing" })
        .click(),
    ]);

    await distributedTracingLink
      .getByRole("heading", {
        name: "Introduction to distributed tracing",
      })
      .click();

    await distributedTracingLink.close();

    const [supportedFrameworkDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page
        .getByRole("link", { name: "Requirements and supported frameworks" })
        .click(),
    ]);

    await supportedFrameworkDoc
      .getByRole("heading", {
        name: "Ruby agent requirements and supported frameworks",
      })
      .click();

    await supportedFrameworkDoc.close();

    // await page.getByTestId("platform.user-feedback-button").click();

    // await page
    //   .getByRole("heading", { name: "Do you have specific feedback for us?" })
    //   .isVisible();

    // await page.getByRole("button", { name: "Close modal" }).click();

    // await page.getByTestId("platform.stacked-view-close-button").click();

    // await page.getByTestId("install-newrelic.button-back-to-home").click();
  });

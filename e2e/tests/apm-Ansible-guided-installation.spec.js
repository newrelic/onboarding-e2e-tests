import { test, expect } from "@playwright/test";
const { chromium } = require("playwright");

let browser;
let context;
let page;

// update the script for Ansible user flow following the 
// instructions in the UI
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

test.describe("Node JS Guided installation", () => {
  test.skip("should shows different methods to install the Node JS", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByTestId("install-newrelic.tile-nodejs").click();

    await page
      .getByRole("button", { name: "Select your language (Node JS)" })
      .isVisible();

    await expect(page.getByText("Install the Node JS agent")).toBeVisible();

    await page.getByRole("button", { name: "Begin installation" }).click();

    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText("Choose your instrumentation method")
    ).toBeVisible();

    await expect(
      page.getByText("Package manager", { exact: true })
    ).toBeVisible();

    await expect(page.getByText("Docker", { exact: true })).toBeVisible();

    await expect(
      page.getByText("On a host (PM2)", { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText("On a host (without PM2)", { exact: true })
    ).toBeVisible();

    await expect(page.getByText("Lambda", { exact: true })).toBeVisible();

    await page.getByTestId("platform.stacked-view-close-button").click();
  });

  test.skip("should shows steps to install the Node JS through Package manager", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByTestId("install-newrelic.tile-nodejs").click();

    await page.getByRole("button", { name: "Begin installation" }).click();

    await page.waitForLoadState("networkidle");

    await page.getByRole("heading", { name: "Package manager" }).click();

    await expect(page.getByText("Name your application")).toBeVisible();

    await page.getByRole("button", { name: "Save" }).isDisabled();

    await page.getByRole("textbox").fill("testApp");

    await page.getByRole("button", { name: "Save" }).isEnabled();

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("npm install newrelic --save")).toBeVisible();

    await page.getByRole("radio", { name: "Yarn" }).click();

    await expect(page.getByText("yarn add newrelic")).toBeVisible();

    await page.getByRole("radio", { name: "npm" }).click();

    await expect(
      page.getByText(
        `Download the config file and put it in your Node.js application’s root directory.`
      )
    ).toBeVisible();

    await expect(
      page.getByText(` * New Relic agent configuration.`)
    ).toBeVisible();

    await expect(page.getByText(`app_name: ['testApp']`)).toBeVisible();

    await expect(
      page.getByText(
        `Add this command line flag when starting your app's main module (make sure to substitute in your file's name).`
      )
    ).toBeVisible();

    await expect(
      page.getByText(`node -r newrelic YOUR_MAIN_FILENAME.js`)
    ).toBeVisible();

    await expect(
      page.getByText(
        `If you're using ECMAScript modules, use the following command-line flag instead when starting your main module.`
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        `node --experimental-loader=newrelic/esm-loader.mjs YOUR_MAIN_FILENAME.js`
      )
    ).toBeVisible();

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(
      page.getByText("Connect your logs and infrastructure")
    ).toBeVisible();

    /* NEED TO DEFINE data-test-id FOR LINUX COMMAND SNIPPET */

    await page.getByRole("radio", { name: "Windows" }).click();

    /* NEED TO DEFINE data-test-id FOR WINDOWS COMMAND SNIPPET */

    await page.getByRole("radio", { name: "Docker" }).click();

    /* NEED TO DEFINE data-test-id FOR DOCKER COMMAND SNIPPET */

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(
      page.getByText("Restart your app, then test your connection.")
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Test connection" })
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "See your data" })
    ).toBeDisabled();

    await page
      .getByRole("button", { name: "Choose a different method" })
      .click();

    await expect(
      page.getByText(
        "You will lose all instrumentation progress on the current application if you change the install method."
      )
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Reset progress" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Cancel" }).click();

    await page.getByTestId("platform.stacked-view-close-button").click();
  });

  test.skip("should shows steps to install the Node JS through Docker", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByTestId("install-newrelic.tile-nodejs").click();

    await page.getByRole("button", { name: "Begin installation" }).click();

    await page.waitForLoadState("networkidle");

    await page.getByRole("heading", { name: "Docker" }).click();

    await expect(page.getByText("Name your application")).toBeVisible();

    await page.getByRole("button", { name: "Save" }).isDisabled();

    await page.getByRole("textbox").fill("testApp");

    await page.getByRole("button", { name: "Save" }).isEnabled();

    await page.getByRole("button", { name: "Save" }).click();

    await expect(
      page.getByText(
        "Follow these steps to start monitoring your app. Use environment variables to make changes to your agent configuration."
      )
    ).toBeVisible();

    await expect(
      page.getByText(`Add 'newrelic' as a dependency to your package.json file`)
    ).toBeVisible();

    await expect(page.getByText(`"newrelic": "latest"`)).toBeVisible();

    await expect(
      page.getByText(`In the first line of your app's main module, add:`)
    ).toBeVisible();

    await expect(page.getByText(`require('newrelic');`)).toBeVisible();

    await expect(
      page.getByText(`Add this ENV line to your Dockerfile`)
    ).toBeVisible();

    await expect(
      page.getByText(`ENV NEW_RELIC_NO_CONFIG_FILE=true`)
    ).toBeVisible();

    await expect(
      page.getByText(`Set the config options via ENV directives`)
    ).toBeVisible();

    await expect(
      page.getByText("ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true")
    ).toBeVisible();

    const [otherConfigOptionsDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page
        .getByRole("link", { name: "other agent configuration options" })
        .click(),
    ]);

    await otherConfigOptionsDoc
      .getByRole("heading", { name: "Node.js agent configuration" })
      .isVisible();

    await otherConfigOptionsDoc.close();

    await expect(
      page.getByText("Add environment variables and run the command")
    ).toBeVisible();

    const [nodeJSReleaseNotesDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "See Node.js release notes" }).click(),
    ]);

    await nodeJSReleaseNotesDoc
      .getByRole("heading", { name: "Node.js agent release notes" })
      .isVisible();

    await nodeJSReleaseNotesDoc.close();

    const [packageJsonDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "See our package.json docs" }).click(),
    ]);

    await packageJsonDoc
      .getByRole("heading", { name: "package.json" })
      .isVisible();

    await packageJsonDoc.close();

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(
      page.getByText("Restart your app, then test your connection.")
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Test connection" })
    ).toBeVisible();

    await page.getByTestId("platform.stacked-view-close-button").click();
  });

  test.skip("should shows steps to install the Node JS On a host (PM2)", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByTestId("install-newrelic.tile-nodejs").click();

    await page.getByRole("button", { name: "Begin installation" }).click();

    await page.waitForLoadState("networkidle");

    await page.getByRole("heading", { name: "On a host (PM2)" }).click();

    await expect(
      page.getByText("If you use a firewall, configure your proxy")
    ).toBeVisible();

    await expect(
      page.getByText(
        "Run this command on your host to download and install the integration"
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        "curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh"
      )
    ).toBeVisible();

    const [installationDocs] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "installation docs" }).click(),
    ]);

    await installationDocs
      .getByRole("heading", { name: "Install the Node.js agent" })
      .isVisible();

    await installationDocs.close();

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(
      page.getByRole("button", { name: "Test connection" })
    ).toBeVisible();

    await page.getByTestId("platform.stacked-view-close-button").click();
  });

  test.skip("should shows steps to install the Node JS On a host (without PM2)", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByTestId("install-newrelic.tile-nodejs").click();

    await page.getByRole("button", { name: "Begin installation" }).click();

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "On a host (without PM2)" })
      .click();

    await expect(page.getByText("Name your application")).toBeVisible();

    await page.getByRole("button", { name: "Save" }).isDisabled();

    await page.getByRole("textbox").fill("testApp");

    await page.getByRole("button", { name: "Save" }).isEnabled();

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("npm install newrelic --save")).toBeVisible();

    await page.getByRole("radio", { name: "Yarn" }).click();

    await expect(page.getByText("yarn add newrelic")).toBeVisible();

    await page.getByRole("radio", { name: "npm" }).click();

    await expect(
      page.getByText(
        `Download the config file and put it in your Node.js application’s root directory.`
      )
    ).toBeVisible();

    await expect(
      page.getByText(` * New Relic agent configuration.`)
    ).toBeVisible();

    await expect(page.getByText(`app_name: ['testApp']`)).toBeVisible();

    await expect(
      page.getByText(
        `Add this command line flag when starting your app's main module (make sure to substitute in your file's name).`
      )
    ).toBeVisible();

    await expect(
      page.getByText(`node -r newrelic YOUR_MAIN_FILENAME.js`)
    ).toBeVisible();

    await expect(
      page.getByText(
        `If you're using ECMAScript modules, use the following command-line flag instead when starting your main module.`
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        `node --experimental-loader=newrelic/esm-loader.mjs YOUR_MAIN_FILENAME.js`
      )
    ).toBeVisible();

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(
      page.getByText("Connect your Logs and Infrastructure")
    ).toBeVisible();

    /* NEED TO DEFINE data-test-id FOR LINUX COMMAND SNIPPET */

    await page.getByRole("radio", { name: "Windows" }).click();

    /* NEED TO DEFINE data-test-id FOR WINDOWS COMMAND SNIPPET */

    await page.getByRole("radio", { name: "Docker" }).click();

    /* NEED TO DEFINE data-test-id FOR DOCKER COMMAND SNIPPET */

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(
      page.getByText("Restart your app, then test your connection.")
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Test connection" })
    ).toBeVisible();

    await page.getByTestId("platform.stacked-view-close-button").click();
  });
});

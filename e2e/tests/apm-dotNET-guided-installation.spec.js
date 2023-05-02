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

test.describe(".NET Guided installation", () => {
  test("should shows different methods available to install the .NET", async () => {
    test.slow();

    await page.getByTestId("install-newrelic.apm-tab").click();

    await page.getByTestId("install-newrelic.tile-dotnet").click();

    const selectEnvironmentHeading = await page.locator(
      `div[data-test-id="install-newrelic.steps-item"]`
    );

    await expect(selectEnvironmentHeading).toContainText(
      "Select your language (.NET)"
    );

    await expect(page.getByTestId("install-newrelic.title")).toContainText(
      "Install the .NET agent"
    );

    await page
      .getByTestId("install-newrelic.button-begin-installation")
      .click();

    await page.waitForLoadState("networkidle");

    await expect(
      page.getByTestId("install-newrelic.dotnet-linux-host")
    ).toContainText("On a Linux host");

    await expect(
      page.getByTestId("install-newrelic.dotnet-with-iis")
    ).toContainText("On a Windows host with IIS");

    await expect(
      page.getByTestId("install-newrelic.dotnet-without-iis")
    ).toContainText("On a Windows host without IIS");

    await expect(
      page.getByTestId("install-newrelic.dotnet-docker-linux-link")
    ).toContainText("Docker for Linux");

    await expect(
      page.getByTestId("install-newrelic.dotnet-docker-windows-link")
    ).toContainText("Docker for Windows");

    await expect(
      page.getByTestId("install-newrelic.dotnet-azure-link")
    ).toContainText("Azure Web Apps");

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

    const feedbackTitle = await page.getByTestId(
      "install-newrelic.modal-title"
    );

    await expect(feedbackTitle).toContainText("Help us improve New Relic One");

    await page.getByRole("button", { name: "Close modal" }).click();

    await page.getByTestId("install-newrelic.apm-footer-back-button").click();
  });

  test("should guide steps to install the .NET agent on a Linux host", async () => {
    test.slow();

    await page.getByTestId("install-newrelic.apm-tab").click();

    await page.getByTestId("install-newrelic.tile-dotnet").click();

    await page
      .getByTestId("install-newrelic.button-begin-installation")
      .click();

    const dockerLinux = page.getByTestId("install-newrelic.dotnet-linux-host");

    await dockerLinux.click();

    const instllationCommand = `curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh`;

    await expect(
      page.getByTestId("install-newrelic.code-snippet")
    ).toContainText(instllationCommand);

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

    const feedbackTitle = page.getByTestId("install-newrelic.feedback-title");

    await expect(feedbackTitle).toContainText(
      "How is New Relic One working for you, right now?"
    );

    await page.getByRole("button", { name: "Close modal" }).click();

    await page
      .getByTestId("install-newrelic.footer-action-dotnet-agent-installer")
      .click();

    const addDotNet = page.getByTestId("setup.heading");

    await expect(addDotNet).toContainText("Add your .NET application data");

    const [seeAppNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "See our docs on naming" }).click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByText("Name or change the name of your application")
      .isVisible();

    await seeAppNamingDoc.close();

    await page.getByTestId("setup.see-your-data-button").isDisabled();

    const applicationNameContainer = await page.locator(
      'div[data-test-id="setup.naming-textfield"]'
    );

    const applicationNameInput = await applicationNameContainer.locator(
      'input[type="text"]'
    );

    await applicationNameInput.fill("testApp");

    const aptTitle = await page.locator('div[data-test-id="setup.apt"]');

    const aptRadio = await aptTitle.locator('input[type="radio"]');

    await aptRadio.check();

    const installCommand = page.getByTestId("setup.install-agent-command");

    await expect(installCommand).toContainText(
      `sudo apt-get install newrelic-dotnet-agent`
    );

    await page.getByTestId("setup.see-your-data-button").isEnabled();

    await expect(
      page.getByText(
        "Copy this command into your host to enable infrastructure and logs metrics."
      )
    ).toBeVisible();

    await expect(page.getByTestId("setup.agent-commands")).toContainText(
      `NEW_RELIC_API_KEY=NRAK-`
    );

    const tabItems = await page.locator(`button[data-test-id="setup.tabs"]`);

    await tabItems.nth(1).click();

    await expect(page.getByTestId("setup.agent-commands")).toContainText(
      `$env:NEW_RELIC_API_KEY=`
    );

    await tabItems.nth(2).click();

    await expect(page.getByTestId("setup.agent-commands")).toContainText(
      `NRIA_LICENSE_KEY=`
    );

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("setup.install-dotnet-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Monitor your .NET app" })
      .isVisible();

    await agentInstallationDoc.close();

    const [agentNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("setup.app-naming-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", {
        name: "Name or change the name of your application",
      })
      .isVisible();

    await agentNamingDoc.close();

    const [distributedTracingLink] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("setup.distributed-tracing-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Introduction to distributed tracing" })
      .isVisible();

    await distributedTracingLink.close();

    await page.getByTestId("platform.user-feedback-button").nth(1).click();

    await page.getByTestId("install-newrelic.feedback-question").isVisible();

    await page.getByRole("button", { name: "Close modal" }).click();

    await page.getByTestId("platform.stacked-view-close-button").nth(1).click();

    await page
      .getByTestId("install-newrelic.footer-action-back-button")
      .click();

    await page.getByTestId("install-newrelic.button-back-to-home").click();
  });

  test("should guide steps to install the .NET agent On a Windows host with IIS", async () => {
    test.slow();

    await page.getByTestId("install-newrelic.apm-tab").click();

    await page.getByTestId("install-newrelic.tile-dotnet").click();

    await page
      .getByTestId("install-newrelic.button-begin-installation")
      .click();

    const dockerIIS = page.getByTestId("install-newrelic.dotnet-with-iis");

    await dockerIIS.click();

    const headingText = page.getByTestId("install-newrelic.heading-text");

    await expect(headingText).toContainText(
      "Copy and run this command in PowerShell and run as administrator"
    );

    const fireWallMessage = await page.locator(
      `div[data-test-id="install-newrelic.proxy-doc"]`
    );

    await expect(fireWallMessage).toContainText(
      "Using a firewall? Configure your proxy first."
    );

    const paragraphElement = await page.locator(
      `div[data-test-id="install-newrelic.proxy-doc"]`
    );
    const linkElement = await paragraphElement.locator("a");

    const [httpsProxyDoc] = await Promise.all([
      page.waitForEvent("popup"),
      await linkElement.click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByText("The proxy element supports the following attributes:")
      .isVisible();

    await httpsProxyDoc.close();

    await expect(
      page.getByTestId("install-newrelic.code-snippet")
    ).toContainText(`$env:NEW_RELIC_API_KEY`);

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

    const feedbackTitle = await page.getByTestId(
      "install-newrelic.modal-title"
    );

    await expect(feedbackTitle).toContainText("Help us improve New Relic One");

    await page.getByRole("button", { name: "Close modal" }).click();

    await page
      .getByTestId("install-newrelic.footer-action-dotnet-agent-installer")
      .click();

    const addDotNet = page.getByTestId("setup.heading");

    await expect(addDotNet).toContainText("Add your .NET application data");

    const [seeAppNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "See our docs on naming" }).click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByText("Name or change the name of your application")
      .isVisible();

    await seeAppNamingDoc.close();

    await page.getByTestId("setup.see-your-data-button").isDisabled();

    const applicationNameContainer = await page.locator(
      'div[data-test-id="setup.naming-textfield"]'
    );

    const applicationNameInput = await applicationNameContainer.locator(
      'input[type="text"]'
    );

    await applicationNameInput.fill("testApp");

    const aptTitle = await page.locator('div[data-test-id="setup.apt"]');

    const aptRadio = await aptTitle.locator('input[type="radio"]');

    await aptRadio.check();

    const installCommand = page.getByTestId("setup.install-agent-command");

    await expect(installCommand).toContainText(
      `sudo apt-get install newrelic-dotnet-agent`
    );

    await page.getByTestId("setup.see-your-data-button").isEnabled();

    await expect(
      page.getByText(
        "Copy this command into your host to enable infrastructure and logs metrics."
      )
    ).toBeVisible();

    await expect(page.getByTestId("setup.agent-commands")).toContainText(
      `NEW_RELIC_API_KEY=NRAK-`
    );

    const tabItems = await page.locator(`button[data-test-id="setup.tabs"]`);

    await tabItems.nth(1).click();

    await expect(page.getByTestId("setup.agent-commands")).toContainText(
      `$env:NEW_RELIC_API_KEY=`
    );

    await tabItems.nth(2).click();

    await expect(page.getByTestId("setup.agent-commands")).toContainText(
      `NRIA_LICENSE_KEY=`
    );

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("setup.install-dotnet-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Monitor your .NET app" })
      .isVisible();

    await agentInstallationDoc.close();

    const [agentNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("setup.app-naming-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", {
        name: "Name or change the name of your application",
      })
      .isVisible();

    await agentNamingDoc.close();

    const [distributedTracingLink] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("setup.distributed-tracing-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Introduction to distributed tracing" })
      .isVisible();

    await distributedTracingLink.close();

    await page.getByTestId("platform.stacked-view-close-button").nth(1).click();

    await page
      .getByTestId("install-newrelic.footer-action-back-button")
      .click();

    await page.getByTestId("install-newrelic.button-back-to-home").click();
  });

  test("should guide steps to install the .NET agent On a Windows host without IIS", async () => {
    test.slow();

    await page.getByTestId("install-newrelic.apm-tab").click();

    await page.getByTestId("install-newrelic.tile-dotnet").click();

    await page
      .getByTestId("install-newrelic.button-begin-installation")
      .click();

    const dockerWIthoutIIS = page.getByTestId(
      "install-newrelic.dotnet-without-iis"
    );

    await dockerWIthoutIIS.click();

    const addDotNet = page.getByTestId("setup.heading");

    await expect(addDotNet).toContainText("Add your .NET application data");

    const [seeAppNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "See our docs on naming" }).click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByText("Name or change the name of your application")
      .isVisible();

    await seeAppNamingDoc.close();

    await page.getByTestId("setup.see-your-data-button").isDisabled();

    const applicationNameContainer = await page.locator(
      'div[data-test-id="setup.naming-textfield"]'
    );

    const applicationNameInput = await applicationNameContainer.locator(
      'input[type="text"]'
    );

    await applicationNameInput.fill("testApp");

    const aptTitle = await page.locator('div[data-test-id="setup.apt"]');

    const aptRadio = await aptTitle.locator('input[type="radio"]');

    await aptRadio.check();

    const installCommand = page.getByTestId("setup.install-agent-command");

    await expect(installCommand).toContainText(
      `sudo apt-get install newrelic-dotnet-agent`
    );

    await page.getByTestId("setup.see-your-data-button").isEnabled();

    await expect(
      page.getByText(
        "Copy this command into your host to enable infrastructure and logs metrics."
      )
    ).toBeVisible();

    await expect(page.getByTestId("setup.agent-commands")).toContainText(
      `NEW_RELIC_API_KEY=NRAK-`
    );

    const tabItems = await page.locator(`button[data-test-id="setup.tabs"]`);

    await tabItems.nth(1).click();

    await expect(page.getByTestId("setup.agent-commands")).toContainText(
      `$env:NEW_RELIC_API_KEY=`
    );

    await tabItems.nth(2).click();

    await expect(page.getByTestId("setup.agent-commands")).toContainText(
      `NRIA_LICENSE_KEY=`
    );

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("setup.install-dotnet-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Monitor your .NET app" })
      .isVisible();

    await agentInstallationDoc.close();

    const [agentNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("setup.app-naming-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", {
        name: "Name or change the name of your application",
      })
      .isVisible();

    await agentNamingDoc.close();

    const [distributedTracingLink] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("setup.distributed-tracing-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Introduction to distributed tracing" })
      .isVisible();

    await distributedTracingLink.close();

    await page.getByTestId("platform.stacked-view-close-button").nth(1).click();

    await page.getByTestId("install-newrelic.apm-footer-back-button").click();

    await page.getByTestId("install-newrelic.button-back-to-home").click();
  });

  test("should guide steps to install the .NET agent on Docker for Linux", async () => {
    test.slow();

    await page.getByTestId("install-newrelic.apm-tab").click();

    await page.getByTestId("install-newrelic.tile-dotnet").click();

    await page
      .getByTestId("install-newrelic.button-begin-installation")
      .click();

    const [dotnetDockerLinux] = await Promise.all([
      page.waitForEvent("popup"),
      await page.getByTestId("install-newrelic.dotnet-docker-linux-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", {
        name: "Monitor your .NET app",
      })
      .isVisible();

    await dotnetDockerLinux.close();

    await page.getByTestId("install-newrelic.apm-footer-back-button").click();

    await page.getByTestId("install-newrelic.button-back-to-home").click();
  });

  test("should guide steps to install the .NET agent on Docker for Windows", async () => {
    test.slow();

    await page.getByTestId("install-newrelic.apm-tab").click();

    await page.getByTestId("install-newrelic.tile-dotnet").click();

    await page
      .getByTestId("install-newrelic.button-begin-installation")
      .click();

    const [dotnetDockerWindows] = await Promise.all([
      page.waitForEvent("popup"),
      await page.getByTestId("install-newrelic.dotnet-docker-windows-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", {
        name: "Monitor your .NET app",
      })
      .isVisible();

    await dotnetDockerWindows.close();

    await page.getByTestId("install-newrelic.apm-footer-back-button").click();

    await page.getByTestId("install-newrelic.button-back-to-home").click();
  });

  test("should guide steps to install the .NET agent on Azure Web Apps", async () => {
    test.slow();

    await page.getByTestId("install-newrelic.apm-tab").click();

    await page.getByTestId("install-newrelic.tile-dotnet").click();

    await page
      .getByTestId("install-newrelic.button-begin-installation")
      .click();

    const [azureLink] = await Promise.all([
      page.waitForEvent("popup"),
      await page.getByTestId("install-newrelic.dotnet-azure-link").click(),
    ]);

    await azureLink.waitForLoadState("networkidle");

    await azureLink
      .getByRole("heading", {
        name: "Install the .NET agent on Azure Web Apps",
      })
      .isVisible();

    await azureLink.close();

    await page.getByTestId("install-newrelic.apm-footer-back-button").click();

    await page.getByTestId("install-newrelic.button-back-to-home").click();
  });
});

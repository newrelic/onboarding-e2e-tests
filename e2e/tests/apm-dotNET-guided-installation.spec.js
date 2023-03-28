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

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByRole("radio", { name: ".NET" }).click();

    await page
      .getByRole("button", { name: "Select your language (.NET)" })
      .isVisible();

    await expect(page.getByText("Install the .NET agent")).toBeVisible();

    await page.getByRole("button", { name: "Begin installation" }).click();

    await page
      .getByRole("heading", {
        name: "How do you want to install the .NET agent?",
      })
      .isVisible();

    await page.getByRole("heading", { name: "On a Linux host" }).isVisible();

    await page
      .getByRole("heading", { name: "On a Windows host with IIS" })
      .isVisible();

    await page
      .getByRole("heading", { name: "On a Windows host without IIS" })
      .isVisible();

    await page.getByRole("heading", { name: "Docker" }).isVisible();

    await page.getByRole("heading", { name: "Azure Web Apps" }).isVisible();

    await page.getByRole("heading", { name: "AWS Lambda" }).isVisible();

    const [docsLink] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "See our docs" }).click(),
    ]);

    await page
      .getByRole("heading", { name: "Guided install overview" })
      .isVisible();

    await docsLink.close();

    await page.getByText("Give feedback").click();

    await expect(page.getByText("Help us improve New Relic One")).toBeVisible();

    await page.getByRole("button", { name: "Close modal" }).click();

    await page.getByTestId("install-newrelic.apm-footer-back-button").click();
  });

  test("should guide steps to install the .NET agent on a Linux host", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByRole("radio", { name: ".NET" }).click();

    await page.getByRole("button", { name: "Begin installation" }).click();

    await page.getByRole("heading", { name: "On a Linux host" }).click();

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

    await expect(
      page.getByText("How is New Relic One working for you, right now?")
    ).toBeVisible();

    await page.getByRole("button", { name: "Close modal" }).click();

    await page
      .getByTestId("install-newrelic.footer-action-dotnet-agent-installer")
      .click();

    await page
      .getByRole("heading", { name: "Add your .NET application data" })
      .isVisible();

    await page
      .getByRole("heading", { name: "Give your application a name" })
      .isVisible();

    const [seeAppNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "See our docs on naming" }).click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByText("Name or change the name of your application")
      .isVisible();

    await seeAppNamingDoc.close();

    await page.getByRole("button", { name: "See your data" }).isDisabled();

    await page.getByRole("textbox").fill("testApp");

    await page.getByLabel("apt").check();

    await page
      .getByText("sudo apt-get install newrelic-dotnet-agent")
      .isVisible();

    await page.getByRole("button", { name: "See your data" }).isEnabled();

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

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "Install the .NET agent" }).click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Monitor your .NET app" })
      .isVisible();

    await agentInstallationDoc.close();

    const [agentNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "How to name your app" }).click(),
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
      page
        .getByRole("link", { name: "Introduction to distributed tracing" })
        .click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Introduction to distributed tracing" })
      .isVisible();

    await distributedTracingLink.close();

    /* open instrumentation doc is unavailable */
    // const [openInstrumentationDoc] = await Promise.all([
    //   page.waitForEvent('popup'),
    //   page.getByRole('link', { name: 'Open instrumentation' }).click(),
    // ]);

    await page.getByTestId("platform.user-feedback-button").nth(1).click();

    await page
      .getByRole("heading", { name: "Do you have specific feedback for us?" })
      .isVisible();

    await page.getByRole("button", { name: "Close modal" }).click();

    await page.getByTestId("platform.stacked-view-close-button").nth(1).click();

    await page
      .getByTestId("install-newrelic.footer-action-back-button")
      .click();
  });

  test("should guide steps to install the .NET agent On a Windows host with IIS", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByRole("radio", { name: ".NET" }).click();

    await page.getByRole("button", { name: "Begin installation" }).click();

    await page
      .getByRole("heading", { name: "On a Windows host with IIS" })
      .click();

    await expect(
      page.getByText(
        "Copy and run this command in PowerShell and Run as administrator"
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        "To allow data through your firewall, set the HTTPS_PROXY environment variable to your proxy’s URL before you run the command below."
      )
    ).toBeVisible();

    await expect(
      page.getByTestId("install-newrelic.code-snippet")
    ).toContainText(`$env:NEW_RELIC_API_KEY`);

    const [footerDocsLink] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("install-newrelic.docs-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page.getByText("Guided install overview").isVisible();

    await footerDocsLink.close();

    await page.getByTestId("install-newrelic.feedback-link").click();

    await expect(
      page.getByText("How is New Relic One working for you, right now?")
    ).toBeVisible();

    await page.getByRole("button", { name: "Close modal" }).click();

    await page
      .getByTestId("install-newrelic.footer-action-dotnet-agent-installer")
      .click();

    await page
      .getByRole("heading", { name: "Add your .NET application data" })
      .isVisible();

    await page
      .getByRole("heading", { name: "Give your application a name" })
      .isVisible();

    const [seeAppNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "See our docs on naming" }).click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByText("Name or change the name of your application")
      .isVisible();

    await seeAppNamingDoc.close();

    await page.getByRole("button", { name: "See your data" }).isDisabled();

    /* need to define test-id */
    await page.getByRole("textbox").fill("testApp");

    await page.getByLabel("apt").check();

    await page
      .getByText("sudo apt-get install newrelic-dotnet-agent")
      .isVisible();

    await page.getByRole("button", { name: "See your data" }).isEnabled();

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

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "Install the .NET agent" }).click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Monitor your .NET app" })
      .isVisible();

    await agentInstallationDoc.close();

    const [agentNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "How to name your app" }).click(),
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
      page
        .getByRole("link", { name: "Introduction to distributed tracing" })
        .click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Introduction to distributed tracing" })
      .isVisible();

    await distributedTracingLink.close();

    // open instrumentation doc is unavailable
    // const [openInstrumentationDoc] = await Promise.all([
    //   page.waitForEvent('popup'),
    //   page.getByRole('link', { name: 'Open instrumentation' }).click(),
    // ]);

    await page.getByTestId("platform.stacked-view-close-button").nth(1).click();

    await page
      .getByTestId("install-newrelic.footer-action-back-button")
      .click();
  });

  test("should guide steps to install the .NET agent On a Windows host without IIS", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByRole("radio", { name: ".NET" }).click();

    await page.getByRole("button", { name: "Begin installation" }).click();

    await page
      .getByRole("heading", { name: "On a Windows host without IIS" })
      .click();

    await page
      .getByRole("heading", { name: "Add your .NET application data" })
      .isVisible();

    /* need to define test-id */
    const [seeAppNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "See our docs on naming" }).click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByText("Name or change the name of your application")
      .isVisible();

    await seeAppNamingDoc.close();

    await page.getByRole("button", { name: "See your data" }).isDisabled();

    /* need to define test-id */
    await page.getByRole("textbox").fill("testApp");

    await page.getByLabel("apt").check();

    await page
      .getByText("sudo apt-get install newrelic-dotnet-agent")
      .isVisible();

    await page.getByRole("button", { name: "See your data" }).isEnabled();

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

    const [agentInstallationDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "Install the .NET agent" }).click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Monitor your .NET app" })
      .isVisible();

    await agentInstallationDoc.close();

    const [agentNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "How to name your app" }).click(),
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
      page
        .getByRole("link", { name: "Introduction to distributed tracing" })
        .click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Introduction to distributed tracing" })
      .isVisible();

    await distributedTracingLink.close();

    // open instrumaentation doc is unavailable
    // const [openInstrumentationDoc] = await Promise.all([
    //   page.waitForEvent('popup'),
    //   page.getByRole('link', { name: 'Open instrumentation' }).click(),
    // ]);

    await page.getByTestId("platform.stacked-view-close-button").nth(1).click();

    await page.getByTestId("install-newrelic.apm-footer-back-button").click();
  });

  test("should guide steps to install the .NET agent on Docker for Linux ", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByRole("radio", { name: ".NET" }).click();

    await page.getByRole("button", { name: "Begin installation" }).click();

    const [dotnetDockerLinux] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("install-newrelic.dotnet-docker-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    const queryParamsLinux = {
      deployment: "linux",
    };
    const queryStringLinux = Object.keys(queryParamsLinux)
      .map((key) => `${key}=${queryParamsLinux[key]}`)
      .join("&");

    await dotnetDockerLinux.goto(`https://docs.newrelic.com/install/dotnet/?${queryStringLinux}`);

    const urlLinux = await dotnetDockerLinux.url();

    expect(urlLinux).toContain("deployment=linux");

    await dotnetDockerLinux.close();
    
    await page.getByTestId("install-newrelic.apm-footer-back-button").click();
  });

  test("should guide steps to install the .NET agent on Docker for windows ", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByRole("radio", { name: ".NET" }).click();

    await page.getByRole("button", { name: "Begin installation" }).click();

    await page.waitForLoadState("networkidle");

    const [dotnetDockerWindows] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("heading", { name: "Docker for Windows" }).click(),
    ]);

    await dotnetDockerWindows.waitForLoadState("networkidle");

    const queryParamsWindows = {
      deployment: "windowsInstall",
    };

    const queryStringWindows = Object.keys(queryParamsWindows)
      .map((key) => `${key}=${queryParamsWindows[key]}`)
      .join("&");

    await dotnetDockerWindows.goto(`https://docs.newrelic.com/install/dotnet/?${queryStringWindows}`);

    const urlWindows = await dotnetDockerWindows.url();

    expect(urlWindows).toContain("deployment=windowsInstall");

    await dotnetDockerWindows.close();
    
    await page.getByTestId("install-newrelic.apm-footer-back-button").click();
  });

  test("should guide steps to install the .NET agent on Azure Web Apps", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByRole("radio", { name: ".NET" }).click();

    await page.getByRole("button", { name: "Begin installation" }).click();

      const [azureLink] = await Promise.all([
        page.waitForEvent("popup"),
        page.getByRole("heading", { name: "Azure Web Apps" }).click(),
      ]);
  
      await azureLink.waitForLoadState("networkidle");
  
      await azureLink
        .getByRole("heading", {
          name: "Install the .NET agent on Azure Web Apps",
        })
        .isVisible();
  
      await azureLink.close();
  
      await page.getByTestId("install-newrelic.apm-footer-back-button").click();
  });
});
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

test.describe("Java Guided installation", () => {
  test("should show different methods to install the Java agent", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByTestId("install-newrelic.tile-java").click();

    await expect(page.getByText("Select your language (Java)")).toBeVisible();

    await expect(page.getByText("Install the Java agent")).toBeVisible();

    await page
      .getByTestId("install-newrelic.button-begin-installation")
      .click();

    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText("How do you want to install the Java agent?")
    ).toBeVisible();

    await page.getByRole("heading", { name: "On a host" }).isVisible();

    await page.getByRole("heading", { name: "Gradle" }).isVisible();

    await page.getByRole("heading", { name: "Maven" }).isVisible();

    await page.getByRole("heading", { name: "Docker" }).isVisible();

    await page.getByRole("heading", { name: "AWS Lambda" }).isVisible();

    const [docsLink] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "See our docs" }).click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Guided install overview" })
      .isVisible();

    await docsLink.close();

    await page.getByText("Give feedback").click();

    await expect(page.getByText("Help us improve New Relic One")).toBeVisible();

    await page.getByRole("button", { name: "Close modal" }).click();

    await page.getByTestId("install-newrelic.apm-footer-back-button").click();
  });

  test("should guide steps to install the Java agent through Gradle, Maven and Docker", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByTestId("install-newrelic.tile-java").click();

    await page
      .getByTestId("install-newrelic.button-begin-installation")
      .click();

    await page.waitForLoadState("networkidle");

//     await expect(
//       page.getByText("How do you want to install the Java agent?")
//     ).toBeVisible();

    const [gradleDocsLink] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("install-newrelic.java-gradle-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Monitor your Java app" })
      .isVisible();

    await gradleDocsLink.close();

    const [mavenDocsLink] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("install-newrelic.java-maven-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", { name: "Monitor your Java app" })
      .isVisible();

    await mavenDocsLink.close();

    const [dockerDocsLink] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("install-newrelic.java-docker-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByRole("heading", {
        name: "Install New Relic Java agent for Docker",
      })
      .isVisible();

    await page.waitForLoadState("networkidle");

    await dockerDocsLink.close();

    await page.getByTestId("install-newrelic.apm-footer-back-button").click();
  });

  test("should guide steps to install the Java agent through host", async () => {
    test.slow();

    await page.getByText("APM (Application Monitoring)").click();

    await page.getByTestId("install-newrelic.tile-java").click();

    await page
      .getByTestId("install-newrelic.button-begin-installation")
      .click();

    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText("How do you want to install the Java agent?")
    ).toBeVisible();

    await page
      .getByText("Instrument your app running on a host", { exact: true })
      .click();

    const instllationCommand = `curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh`;

    await expect(
      page.getByTestId("install-newrelic.code-snippet")
    ).toContainText(instllationCommand);

    await expect(
      page.getByTestId("install-newrelic.code-snippet")
    ).toContainText("NEW_RELIC_API_KEY=NRAK");

    await expect(
      page.getByTestId("install-newrelic.code-snippet")
    ).toContainText("java-agent-installer");

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
      .getByTestId("install-newrelic.footer-action-java-agent-installer")
      .click();

    await expect(
      page.getByText("Add your Java application data")
    ).toBeVisible();

    await page.getByTestId("setup.download-button").isDisabled();

    await expect(page.getByText("You must complete step 1")).toBeVisible();

    const [seeAppNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "See our docs on naming" }).click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByText("Name or change the name of your application")
      .isVisible();

    await seeAppNamingDoc.close();

    const applicationNameContainer = await page.locator(
      'div[data-test-id="setup.naming-textfield"]'
    );

    const applicationNameInput = await applicationNameContainer.locator(
      'input[type="text"]'
    );

    await applicationNameInput.fill("testApp");

    await page.getByTestId("setup.download-button").isEnabled();

    await page.getByText("You must complete step 1").isHidden();

    const downloadAndInstallCommand = `curl -O https://download.newrelic.com/newrelic/java-agent/newrelic-agent/current/newrelic-java.zip`;

    await expect(page.getByText(downloadAndInstallCommand)).toBeVisible();

    await expect(
      page.getByText("Get specific instructions for your Java set up")
    ).toBeVisible();

    await page.getByRole("radio", { name: "Tomcat" }).click();

    await expect(
      page.getByText(
        "You can pass the -javaagent argument on Linux with catalina.sh. On Windows, you can use catalina.bat or the GUI."
      )
    ).toBeVisible();

    await expect(
      page.getByText("With catalina.sh", { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText("With catalina.bat", { exact: true })
    ).toBeVisible();

    await expect(page.getByText("With Windows", { exact: true })).toBeVisible();

    await page.getByText("With catalina.sh", { exact: true }).click();

    const catalinaCommand = `export CATALINA_OPTS="$CATALINA_OPTS -javaagent:FULL_PATH_TO/newrelic.jar"`;

    await expect(page.getByText(catalinaCommand)).toBeVisible();

    const stepFive =
      "Deploy your application to start using the Java agent to send data to New Relic.";

    await expect(page.getByText(stepFive)).toBeVisible();

    await expect(
      page.getByText("Connect with your logs and infrastructure")
    ).toBeVisible();

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

    const [installJavaAgentDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("setup.install-java-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page.getByText("Monitor your Java app").isVisible();

    await installJavaAgentDoc.close();

    const [appNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("setup.app-naming-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByText("Name or change the name of your application")
      .isVisible();

    await appNamingDoc.close();

    const [distributedTracingLink] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByTestId("setup.distributed-tracing-link").click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page.getByText("Introduction to distributed tracing").isVisible();

    await distributedTracingLink.close();

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
});

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
  test("should guide steps to install the Java agent", async () => {
    test.slow();

    await page.getByTestId("install-newrelic.apm-tab").click();

    await page.getByTestId("install-newrelic.tile-java").click();

    const selectEnvironmentHeading = await page.locator(
      `div[data-test-id="install-newrelic.steps-item"]`
    );

    await expect(selectEnvironmentHeading).toContainText(
      "Select your language (Java)"
    );

    const installJava = await page.getByTestId("install-newrelic.title");

    await expect(installJava).toContainText("Install the Java agent");

    await page
      .getByTestId("install-newrelic.button-begin-installation")
      .click();

    await page.waitForLoadState("networkidle");

    await page.waitForSelector(
      '[data-test-id="install-newrelic.installation-title"]'
    );

    await expect(
      page.getByTestId("install-newrelic.java-on-host")
    ).toContainText("On a host");

    await expect(
      page.getByTestId("install-newrelic.java-gradle-link")
    ).toContainText("Gradle");

    await expect(
      page.getByTestId("install-newrelic.java-maven-link")
    ).toContainText("Maven");

    await expect(
      page.getByTestId("install-newrelic.java-docker-link")
    ).toContainText("Docker");

    await expect(
      page.getByTestId("install-newrelic.java-aws-lambda")
    ).toContainText("AWS Lambda");

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
      page.getByTestId("install-newrelic.modal-title")
    ).toContainText("Help us improve New Relic One");

    await page.getByRole("button", { name: "Close modal" }).click();

    await page.getByTestId("install-newrelic.apm-footer-back-button").click();

    await page.getByTestId("install-newrelic.button-back-to-home").click();
  });

  test("should guide steps to install the Java agent through Gradle, Maven and Docker", async () => {
    test.slow();

    await page.getByTestId("install-newrelic.apm-tab").click();

    await page.getByTestId("install-newrelic.tile-java").click();

    await page
      .getByTestId("install-newrelic.button-begin-installation")
      .click();

    await page.waitForLoadState("networkidle");

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

    await dockerDocsLink.close();

    await page.getByTestId("install-newrelic.apm-footer-back-button").click();

    await page.getByTestId("install-newrelic.button-back-to-home").click();
  });

  test("should guide steps to install the Java agent through host", async () => {
    test.slow();

    await page.getByTestId("install-newrelic.apm-tab").click();

    await page.getByTestId("install-newrelic.tile-java").click();

    await page
      .getByTestId("install-newrelic.button-begin-installation")
      .click();

    await page.waitForLoadState("networkidle");

    await page.getByTestId("install-newrelic.java-on-host").click();

    await expect(
      page.getByTestId("install-newrelic.code-snippet")
    ).toContainText(
      `curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh`
    );

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
      page.getByTestId("install-newrelic.modal-title")
    ).toContainText("Help us improve New Relic One");

    await page.getByRole("button", { name: "Close modal" }).click();

    await page
      .getByTestId("install-newrelic.footer-action-java-agent-installer")
      .click();

    await expect(page.getByTestId("setup.heading")).toContainText(
      "Add your Java application data"
    );

    await page.getByTestId("setup.download-button").isDisabled();

    await expect(page.getByTestId("setup.warning-text")).toContainText(
      "You must complete step 1"
    );

    const [seeAppNamingDoc] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "See our docs on naming" }).click(),
    ]);

    await page.waitForLoadState("networkidle");

    await page
      .getByText("Name or change the name of your application")
      .isVisible();

    await seeAppNamingDoc.close();

    const applicationNameContainer = page.locator(
      'div[data-test-id="setup.naming-textfield"]'
    );

    const applicationNameInput =
      applicationNameContainer.locator('input[type="text"]');

    await applicationNameInput.fill("testApp");

    await page.getByTestId("setup.download-button").isEnabled();

    await page.getByText("You must complete step 1").isHidden();

    const installAgent = page.getByTestId("setup.download-install-agent");

    await expect(installAgent).toContainText("Download and install the agent");

    const command = await page.getByTestId("setup.install-agent-command");

    await expect(command).toContainText(
      `curl -O https://download.newrelic.com/newrelic/java-agent/newrelic-agent/current/newrelic-java.zip`
    );

    const javaInstruction = page.getByTestId("setup.java-instructions");

    await expect(javaInstruction).toContainText(
      "Get specific instructions for your Java set up"
    );

    const tomCat = await page.locator('div[data-test-id="setup.tomcat"]');

    const tomCatRadio = await tomCat.locator('input[type="radio"]');

    await tomCatRadio.check();

    const catalinaSH = await page.locator(
      'div[data-test-id="setup.catalina-arrow-commands-With catalina.sh"]'
    );

    await expect(catalinaSH).toContainText("With catalina.sh");

    const catalinaBAT = await page.locator(
      'div[data-test-id="setup.catalina-arrow-commands-With catalina.bat"]'
    );

    await expect(catalinaBAT).toContainText("With catalina.bat");

    const withWindows = await page.locator(
      'div[data-test-id="setup.catalina-arrow-commands-With Windows"]'
    );

    await expect(withWindows).toContainText("With Windows");

    await catalinaSH.click();

    const catalinaSHCommand = await page.getByTestId(
      "setup.catalina-sh-command"
    );

    await expect(catalinaSHCommand).toContainText(
      'export CATALINA_OPTS="$CATALINA_OPTS -javaagent:FULL_PATH_TO/newrelic.jar"'
    );

    const logsInfrastructure = page.getByTestId("setup.logs-infrastructure");

    await expect(logsInfrastructure).toContainText(
      "Connect with your logs and infrastructure"
    );

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
      .click();

    await page.getByRole("button", { name: "Close modal" }).click();

    await page.getByTestId("platform.stacked-view-close-button").nth(1).click();

    await page
      .getByTestId("install-newrelic.footer-action-back-button")
      .click();

    await page.getByTestId("install-newrelic.button-back-to-home").click();
  });
});

import { test, expect } from "@playwright/test";
import deployConfig from './apm-nodeJS-host-deploy.json';
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DynamoDBClient, BatchGetItemCommand } from "@aws-sdk/client-dynamodb";

const { 
  v4: uuidv4,
} = require('uuid');

const awsConfig = {region: process.env.AWS_REGION}

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
  await page.goto("/nr1-core");
});

test.afterEach(async () => {
  await context.close();
});

test.afterAll(async () => {
  await browser.close();
});

test.describe("Node JS host installation", () => {
  test("should install on a newly created host", async () => {
    test.slow();
    test.setTimeout(600000); // 10min

    let installCtx = {
      done: false,
      messageId: undefined,
      item: undefined,
      appName: `nodejstest-${Number(new Date())}`
    };

    await page.getByText("Add data").first().click();

    await page.locator('#card-body-wrapper-Logging').getByRole('button', { name: 'Node.js' }).click();

    await page.getByText("On a host").first().click();

    const container = await page.locator(
      'div[id="shared-component-installator.node-js-installation"]'
    );

    // Set App Name
    const applicationNameInput = await container.locator(
      'input[type="text"]'
    );
    await applicationNameInput.fill(installCtx.appName);
    await page.getByText("Save").first().click();

    // step 1 - copy install newrelic
    const step1copy = await page.locator("div.TerminalNode-command")
    var command = []
    for (const item of await step1copy.all()) {
      const val = (await item.innerText())
      command.push(`${val}`)
      if (command.length == 2) {
        break
      }
    }

    /////////////////////////////
    // Send an installation event
    const licenseKey = ""
    const envVars = `NEW_RELIC_LICENSE_KEY=${licenseKey} NEW_RELIC_APP_NAME=${installCtx.appName}`
    const stopNodetron = "sudo /usr/bin/supervisorctl stop nodetron1"

    deployConfig.instrumentations.services[0].params.step_configure = command[0]
    deployConfig.instrumentations.services[0].params.step_onafterstart = `sudo ${stopNodetron};${envVars} ${command[1].replace("YOUR_MAIN_FILENAME.js","server.js")} config/app_config.json 2>&1 &`
    // console.log(deployConfig)

    var messageDeduplicationId = uuidv4();
    const client = new SQSClient(awsConfig);
    const input = { // SendMessageRequest
      QueueUrl: "https://sqs.us-east-2.amazonaws.com/709144918866/testDeployerQueue.fifo",
      MessageBody: JSON.stringify(deployConfig,null,2),
      MessageAttributes: { },
      MessageDeduplicationId: messageDeduplicationId,
      MessageGroupId: messageDeduplicationId,
    };
    const sqsCommand = new SendMessageCommand(input);
    const response = await client.send(sqsCommand);
    installCtx.messageId = response.MessageId;
    console.log("Success SQS messageId:", installCtx.messageId);
    // installCtx.messageId = "4172ca7c-2ca9-4d73-bef4-0ee16be19fda"
    // installCtx.messageId = "invalid one"

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(
      page.getByText("Connect your Logs and Infrastructure")
    ).toBeVisible();

    await page.getByRole('radio', { name: 'I want to install the agent directly on my host' }).click();

    await page.getByRole('radio', { name: 'Linux' }).click();

    await page.getByLabel('Automatically answer "yes" to all install prompts. We\'ll stop the installer if there\'s an error.').check();

    const infraStepCopy = await page.locator("div.TerminalNode-terminal")
    var command = []
    for (const item of await infraStepCopy.all()) {
      const val = (await item.innerText())
      command.push(`${val}`)
      if (command.length == 2) {
        break
      }
    }
    
    await page.getByRole("button", { name: "Continue" }).click();

    async function waitForInstallationComplete(installCtx) {
      const input = {
        "RequestItems": {
          "DeployResponse": {
            "Keys": [
              {
                "MessageId": {S: installCtx.messageId }
              },
            ]
          }
        }
      };
      const command = new BatchGetItemCommand(input);
      const client = new DynamoDBClient(awsConfig);
      let maxTimeoutSeconds = 600   // 10min
      let delayTimeMilliSeconds = 10000 // 10sec
      let maxTimeoutDate = (new Date() / 1000)+maxTimeoutSeconds
      while ( (!installCtx.done) && (new Date() / 1000) < maxTimeoutDate) {
        const response = await client.send(command);
        if (response.Responses && response.Responses.DeployResponse && response.Responses.DeployResponse.length > 0) {
          var item = response.Responses.DeployResponse[0]
          installCtx.done = true;
          installCtx.item = item;
          if (item.Code && item.Code.N == "0") {
            console.log("Installation Success")
            return Promise.resolve()
          } else {
            console.log("Installation Failed")
            expect(true).toBeFalsy();
            return Promise.reject();
          }
        }
        console.log("Installation not completed yet, will retry")
        await new Promise(r => setTimeout(r, delayTimeMilliSeconds));
      }
      if (!installCtx.done) {
        console.log("Installation Failed Timeout, result:", installCtx.Item);
        expect(true).toBeFalsy();
        return Promise.reject();
      }
    }

    await waitForInstallationComplete(installCtx);

    console.log("Testing connection now")
    await page.getByRole('button', { name: 'Test connection' }).click();

    await expect(
      page.locator('div').filter({hasText: /^Node\.js agent$/}).first()
    ).toBeVisible();

    await expect(
      page.locator('div').filter({hasText: /^On-host logs$/}).first()
    ).toBeVisible();

    await expect(
      page.locator('div').filter({hasText: /^Infrastructure agent$/}).first()
    ).toBeVisible();

    await expect(
      page.getByText("Successfully installed.")
    ).toBeVisible({ timeout: 600000 });

    // await page.getByRole('link', {name: 'See your data'}).click();

    await page.waitForLoadState("networkidle");

  });

});

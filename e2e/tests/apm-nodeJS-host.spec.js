import { test, expect } from "@playwright/test";
import deployConfig from './apm-nodeJS-host-deploy.json';
const { 
  v4: uuidv4,
} = require('uuid');

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_REGION});

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

    await page.getByText("Add data").first().click();

    await page.locator('#card-body-wrapper-Logging').getByRole('button', { name: 'Node.js' }).click();

    await page.getByText("On a host").first().click();

    // Fill app name
    // const applicationNameContainer = await page.locator('#text-field-2');
    // const applicationNameInput =
    // applicationNameContainer.locator('input[type="text"]');
    // *[@id="shared-component-installator.node-js-installation"]/div/div/section

    const container = await page.locator(
      'div[id="shared-component-installator.node-js-installation"]'
    );

    const applicationNameInput = await container.locator(
      'input[type="text"]'
    );
    const appName = "nodetestapp1"
    await applicationNameInput.fill(appName);

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
    const licenseKey = ""
    const envVars = `NEW_RELIC_LICENSE_KEY=${licenseKey} NEW_RELIC_APP_NAME=${appName}`
    const stopNodetron = "sudo /usr/bin/supervisorctl stop nodetron1"

    deployConfig.instrumentations.services[0].params.step_configure = command[0]
    deployConfig.instrumentations.services[0].params.step_onafterstart = `${stopNodetron};${envVars} ${command[1].replace("YOUR_MAIN_FILENAME.js","server.js")} config/app_config.json 2>&1 &`

    // console.log(deployConfig)

    // Create an SQS service object
    var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

    const messageId = uuidv4();
    var params = {
     MessageAttributes: {
      
     },
     MessageBody: JSON.stringify(deployConfig,null,2),
     MessageDeduplicationId: messageId,
     MessageGroupId: messageId,
     QueueUrl: "https://sqs.us-east-2.amazonaws.com/709144918866/testDeployerQueue.fifo"
   };

   sqs.sendMessage(params, function(err, data) {
    if (err) {
      console.log("Error", err);
      expect(true).toBeFalsy();
    } else {
      console.log("Success", data.MessageId);
    }
  });

    await page.waitForLoadState("networkidle");

  });

});

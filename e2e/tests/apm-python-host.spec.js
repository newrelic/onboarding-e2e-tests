import { test, expect } from "@playwright/test";
import deployConfig from './apm-python-host-deploy.json';
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

test.describe("Python host installation", () => {
  test("should install on a newly created host", async () => {
    test.slow();

    await page.getByText("Add data").first().click();

    const divId = await page.locator('div[id^="card-body-wrapper-Application monitoring"]').getByRole('button', { name: 'Python' }).click();

    const container = await page.locator(
      'div[id="shared-component-installator.python-installation"]'
    );

    const applicationNameInput = await container.locator(
      'input[type="text"]'
    );
    const appName = "python-test-app1"
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

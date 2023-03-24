# onboarding-e2e-tests

## Helpful links
| Item | Link |
| ---- | ---- |
| Getting Help | This nerdlet is owned by the Virtuoso team<br>Slack: [#help-virtuoso](https://app.slack.com/client/T02D34WJD/C01PTDC51K2)<br>Page :rotating_light:: `911 teamstore VIRTUOSO` |

## About

This is the **Virtuoso** package responsible for:

- Playwright E2E testing for Guided installation

## Contributing Guidelines

1. Fork the repo.
2. Create a branch request.
3. Implement the change.
4. Verify your tests and all existing tests pass.
5. Open a pull request.
6. Bring the pull request to the attention of the @hero in
    [#help-virtuoso](https://app.slack.com/client/T02D34WJD/C01PTDC51K2)

## Get Started

1. Install the correct Node version: `nvm install`
2. Install dependencies: `npm i`

## Running E2E tests in local

If you would like to run E2E tests locally, you will need to define env vars with your credentials.

```sh
ENV_SECRET_EMAIL='someemail@foo.com'
ENV_SECRET_PASSWORD='mypassword#123'
```

Tests are run and you can trigger via 

```sh
npx playwright test
```

If you would like to test the scripts individually then you can test it with the following command 

```sh
npx playwright test foldername/test-file-name
```
 [for example the command is written in the following way - npx playwright test tests/docker-infra-guided-installation.spec.js] 

## Workers and Retries

Workers are used to run the scripts parallely. The more workers, the more scripts will be able to run parallely so that the testing time can be reduced.

The purpose of Retries is to re-test the scripts if there is any error while running the scripts. For example if you set retries to 2, it tries to execute the test for 2 times if facing an error while running.

The workers and retries can be modified in **playwright.config.js**

## Disabling Headless mode 

To run a playwright e2e test with headless mode disabled (i.e with a visible browser window) you can set headless option to false when launching the browser.

Here is an example commands 

To run playwright e2e test with headless mode disabled 

```sh
npx playwright test --headed
```
 
If you want run a specific test file, you can add path to the file at the end of the command 

```sh
npx playwright test --headed ./tests/mytest.spec.js
```





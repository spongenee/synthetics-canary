var synthetics = require('Synthetics');
var stepConfig = {
    'continueOnStepFailure': true,
    'screenshotOnStepStart': false,
    'screenshotOnStepSuccess': true,
    'screenshotOnStepFailure': true
}
const log = require('SyntheticsLogger');
const syntheticsConfiguration = synthetics.getConfiguration();

const flowBuilderBlueprint = async function () {
    // Setting the log level (0-3)
    synthetics.setLogLevel(process.env.LOG_LEVEL);
    const URL = process.env.URL;
    const login_selector = '#btn_login';
    const username_selector = '#account';
    const password_selector = '#password';
    const account_selector = '#account_id';
    const login_submit_selector = '#btn_submit_login';
    let USERNAME = process.env.USERNAME;
    let PASSWORD = process.env.PASSWORD;

    syntheticsConfiguration.setConfig({
        includeRequestHeaders: true, // Enable if headers should be displayed in HAR
        includeResponseHeaders: true, // Enable if headers should be displayed in HAR
        restrictedHeaders: [], // Value of these headers will be redacted from logs and reports
        restrictedUrlParameters: [] // Values of these url parameters will be redacted from logs and reports
    });
    let page = await synthetics.getPage();

    // Navigate to the initial url
    await synthetics.executeStep('navigateToUrl', async function () {
        try {
            const response = await page.goto(URL);
        } catch (ex) {
            // Add failure reason if navigation fails.
            log.error(ex)
        }
    }, stepConfig);


    await synthetics.executeStep('login', async function () {
        await page.click(login_selector);
        await page.waitForSelector(username_selector);
        await page.type(username_selector, USERNAME);
        await page.type(password_selector, PASSWORD);
        await page.click(login_submit_selector);
    });

    await synthetics.executeStep('getaccount', async function () {
        await page.waitForSelector(account_selector);
        await page.click(account_selector);
    });
    await synthetics.executeStep('verifyaccount', async function () {
        await page.waitForXPath("//*[@id=\"user_account_no\"][contains(text(),USERNAME)]", { timeout: 30000 });
    });
    
};

exports.handler = async () => {
    return await flowBuilderBlueprint();
};
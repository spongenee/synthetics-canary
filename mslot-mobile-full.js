var synthetics = require('Synthetics');

const puppeteer = require('puppeteer-core');
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
    const iPhone = puppeteer.devices['iPhone 6'];
    const login_selector = '.common_input';
    const
    const username_selector = '.common_input[name=name]';
    const password_selector = '.common_input[name=password]';
    const login_submit_selector = "[data-reactid='.0.0.3.0.1.3.0.4.0']";
    const member_selector = "[href='#/soccer/mSlot/integralGiftRecords']";
    let USERNAME = process.env.USERNAME;
    let PASSWORD = process.env.PASSWORD;

    syntheticsConfiguration.setConfig({
        includeRequestHeaders: true, // Enable if headers should be displayed in HAR
        includeResponseHeaders: true, // Enable if headers should be displayed in HAR
        restrictedHeaders: [], // Value of these headers will be redacted from logs and reports
        restrictedUrlParameters: [] // Values of these url parameters will be redacted from logs and reports
    });
    let page = await synthetics.getPage();
    await page.emulate(iPhone);

    // Navigate to the initial url
    await synthetics.executeStep('navigateToUrl', async function () {
        try {
            const response = await page.goto(URL);
        } catch (ex) {
            // Add failure reason if navigation fails.
            log.error(ex)
        }
    }, stepConfig);


    await synthetics.executeStep('navigateToUrl', async function () {
        await page.click('.slider_opener');
    }, stepConfig);

    await synthetics.executeStep('login', async function () {
        await page.click('.slider_opener');
        await page.waitForSelector(login_selector);
        await page.type(username_selector, USERNAME);
        await page.type(password_selector, PASSWORD);
        await page.click(login_submit_selector);

    });

    await synthetics.executeStep('getmember', async function () {
        await page.waitForSelector(member_selector);
        await page.click(member_selector);
        await page.waitForSelector('.interGiftRecords');
    });

    await synthetics.executeStep('soccer-bet', async function () {
        await page.click('.icon_more');
        await page.waitForSelector("[data-reactid='.0.0.3.1.1.0.0.3.1.0.2.0']");
        await page.click("[data-reactid='.0.0.3.1.1.0.0.3.1.0.2.0']");
        await page.waitForSelector('.coming_bet_banner');
        await page.waitForSelector('.commonEvent-content');
        await page.click('.commonEvent-content');
        const element = await page.waitForSelector('.bet_button');
        const value = await element.evaluate(el => el.textContent);
        log.log('Value of soccer bet is ')
        log.log(value)
    });

    await synthetics.executeStep('navigate-basketball', async function () {
        await page.click("[href='#/basketball']");
        await page.click('.page_drop');
        await page.waitForSelector("[data-reactid='.0.0.3.1.1.0.0.3.1.0.2.0']");
        await page.click("[data-reactid='.0.0.3.1.1.0.0.3.1.0.2.0']");
    });

    await synthetics.executeStep('basketball-bet', async function () {
        await page.waitForSelector('.coming_bet_banner');
        await page.waitForSelector('.commonEvent-content');
        await page.click('.commonEvent-content');
        const element = await page.waitForSelector('.bet_button');
        const value = await element.evaluate(el => el.textContent);
        log.log('Value of basketball bet is ')
        log.log(value)
    });

};

exports.handler = async () => {
    return await flowBuilderBlueprint();
};

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
        try {
            await page.click(login_selector);
            await page.waitForSelector(username_selector);
            await page.type(username_selector, USERNAME);
            await page.type(password_selector, PASSWORD);
            await page.click(login_submit_selector);
        } catch (ex) {
            // Add failure reason if navigation fails.
            log.error('Failed to login')
        }
    });

    await synthetics.executeStep('getmember', async function () {
        try {
            await page.waitForSelector(account_selector);
        } catch (ex) {
            // Add failure reason if navigation fails.
            log.error('Proceeding without login')
        }
        await page.click('.msl-sidebar-nav-mslot');
        await page.waitForSelector('.head-line');
    });
    
    await synthetics.executeStep('soccer-bet', async function () {
        await page.click('.to_coming_bet');
        try {
            await page.waitForSelector('.msl-cm-methods');
            await page.waitForSelector('.msl-cm-pager-nav');
            const element = await page.waitForSelector('.badge_front');
            const value = await element.evaluate(el => el.textContent);
            log.info('Value of badge is ')
            log.info(value)
            await page.click('.badge_front');
        } catch (ex) {
            log.error(ex)
        }
    });
    
    await synthetics.executeStep('remove-bet', async function () {
        try {
            await page.waitForSelector('.btnBetRemove');
            await page.click('.btnBetRemove');
        } catch (ex) {
            log.error('No bet to remove from cart')
        }
    });
    
    await synthetics.executeStep('navigate-basketball', async function () {
        await page.click('.msl-nav-basketball');
        await page.waitForSelector('.basketball_content');
    });
    
    await synthetics.executeStep('basketball-bet', async function () {
        await page.click('.to_coming_bet');
        try {
            await page.waitForSelector('.msl-cm-methods');
            await page.waitForSelector('.msl-cm-pager-nav');
            const element = await page.waitForSelector('.badge_front');
            const value = await element.evaluate(el => el.textContent);
            log.info('Value of badge is ')
            log.info(value)
            await page.click('.badge_front');
        } catch (ex) {
            log.error(ex)
        }
    });
        
    await synthetics.executeStep('remove-bet', async function () {
        try {
            await page.waitForSelector('.btnBetRemove');
            await page.click('.btnBetRemove');
        } catch (ex) {
            log.error('No bet to remove from cart')
        }
    });
};

exports.handler = async () => {
    return await flowBuilderBlueprint();
};
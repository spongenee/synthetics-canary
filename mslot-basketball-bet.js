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
    const method_selector = '.msl-cm-methods';

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


    await synthetics.executeStep('click', async function () {
        for (const method of await page.$$('.msl-cm-methods')) {
            await method.click();
            await page.waitForSelector('.msl-bet'); 
        }
    });

};

exports.handler = async () => {
    return await flowBuilderBlueprint();
};
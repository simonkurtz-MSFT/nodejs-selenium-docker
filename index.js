const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const cron = require('node-cron');

const RUN_ONCE = true;  // run once, if true, or continuously once every minute on the minute, if false

if (RUN_ONCE) {
    (async () => await main())();
} else {
    console.log('Waiting for cron schedule to begin.\n');
    cron.schedule('*/1 * * * *', async () => await main());
}

async function main() {
    let driver;

    try {
        driver = await setupBrowser();
        await driver.get('https://github.com');
        const title = await driver.getTitle();
        console.log(title);
    } finally {
        await endBrowser(driver);
    }
}

async function setupBrowser() {
    try {
        console.log('\nInitiating login...')
        let options = new chrome.Options();
        options.addArguments('--headless'); // Add headless mode
        options.addArguments('--disable-gpu'); // Disable GPU
        options.addArguments('--no-sandbox'); // Sandbox
        options.addArguments('--disable-dev-shm-usage'); // Dev shm usage
        let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options) // Set the options
        .build();
        return driver
    } catch (e) {
        console.error(e);
    }
}

async function endBrowser(driver) {
    try {
        if (driver) {
            try {
                await driver.close();   // helps ChromeDriver shut down cleanly and delete the "scoped_dir" temp directories that eventually fill up the hard drive.
            } catch (e) {
                console.error(e);
            }

            try {
                await driver.quit();
            } catch (e) {
                console.error(e);
            }

            driver = null;
            console.log('\nEnded browser and disposed of driver.');
        }
    } catch (e) {
        console.error(e);
    }
}

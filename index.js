import { Builder } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome.js";
import * as cron from "node-cron";

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
    }
    finally {
        await endBrowser(driver);
    }
}

async function setupBrowser() {
    try {
        let options = new Options()
            .excludeSwitches(['enable-logging'])    // disable 'DevTools listening on...'
            .headless()                             // run headless Chrome as we do not need to see the browser execute visually
            .addArguments([
                // no-sandbox is not an advised flag due to security but eliminates "DevToolsActivePort file doesn't exist" error
                'no-sandbox',
                // Docker containers run with 64 MB of dev/shm by default, which may cause Chrome failures.
                // Disabling dev/shm uses tmp, which solves the problem but consumes memory steadily until it stabilizes near memory capacity
                'disable-dev-shm-usage'
            ]);

        return await new Builder().forBrowser('chrome').setChromeOptions(options).build();
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
            console.log('\nEnded browser and disposed of driver.')
        }
    } catch (e) {
        console.error(e);
    }
}
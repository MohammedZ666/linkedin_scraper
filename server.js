const { LinkedInProfileScraper } = require('linkedin-profile-scraper');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const timeout = 60 * 1000;      //  request timeout       
const countryCode = "www";       //  two letter country code
const profileMaxCount = 1;     //  maximum number of profiles to scrape
const sessionCookieValue = 'AQEDATgdkNUEKLlIAAABfHKZ3VUAAAF8lqZhVVYARKmilJUjZjvs31Z8NjbkglT5S9vS6rXs8y5hK_4w-XPJE7uY4ta1ERehuR3UEQRuo9ky0ovRNypghYqlOc0r2d2_rcxVOY0sTEjF9e6A-w1jnGGh';
const query = 'site:linkedin.com/in/ AND "javascript developer" AND "New York"';

// Prepare the scraper
// Loading it in memory

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto('https://www.google.com/', { timeout: timeout });
    await page.waitForSelector('input[name="q"]')
    await page.type('input[name="q"]', query);
    await page.keyboard.press('Enter');
    const profileLinks = [];
    let profileScraped = 0;
    while (profileScraped < profileMaxCount) {
        await page.waitForSelector(`a[href^="https://${countryCode}.linkedin.com/in/"]`)
        let currentLinks = await page.$$eval(`a[href^="https://${countryCode}.linkedin.com/in/"]`, el => el.map(x => x.getAttribute("href")))
        profileLinks.push(...currentLinks);
        profileScraped += currentLinks.length;
        await page.click("#pnnext")
    }
    console.log("Total profiles scraped => ", profileScraped)
    //Deleting excess links
    if (profileScraped > profileMaxCount) {
        let indexDelFrom = profileMaxCount
        profileLinks.splice(indexDelFrom)
    }
    await browser.close();
    console.log("Total profiles demanded => ", profileLinks.length)
    console.log("Profile links => ", profileLinks)
    const scraper = new LinkedInProfileScraper({
        sessionCookieValue: sessionCookieValue,
        keepAlive: true,
        timeout: timeout
    });
    const saveDir = path.join(__dirname, "profiles", "")
    if (!fs.existsSync(saveDir)) {
        fs.mkdirSync('profiles', { recursive: true });
    }
    await scraper.setup()
    for (let i = 0; i < profileLinks.length; i++) {

        let link = profileLinks[i];
        link = link.replace(countryCode, "www")
        let profileJson;
        try {
            profileJson = await scraper.run(link)
        } catch (error) {
            console.log(error)
            continue;
        }
        //console.log(profileJson)

        fs.writeFileSync(`${saveDir}/${link.substring(28)}.json`, JSON.stringify(profileJson, null, 2));
        console.log(`Profiles saved at ${saveDir}`)
    };
    // other actions...
    //await browser.close();
})();

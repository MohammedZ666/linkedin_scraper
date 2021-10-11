const { LinkedInProfileScraper } = require('linkedin-profile-scraper');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const query = 'site:linkedin.com/in/ AND "javascript developer" AND "BRAC University"'
const countryCode = "bd"; //two letter country code
const maxPage = 1;   // no of google search pages to scrape
const sessionCookieValue = '';
// Prepare the scraper
// Loading it in memory

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        channel: "chrome"
    });
    const page = await browser.newPage();
    await page.goto('https://www.google.com/', { timeout: 60 * 1000 });
    await page.waitForSelector('input[name="q"]')
    await page.type('input[name="q"]', query);
    await page.keyboard.press('Enter');
    const profileLinks = [];
    for (let i = 0; i < maxPage; i++) {
        await page.waitForSelector(`a[href^="https://${countryCode}.linkedin.com/in/"]`)
        profileLinks.push(...await page.$$eval(`a[href^="https://${countryCode}.linkedin.com/in/"]`, el => el.map(x => x.getAttribute("href"))));
        await page.click("#pnnext")

    }
    await browser.close();
    console.log(profileLinks.length)
    console.log(profileLinks)
    const scraper = new LinkedInProfileScraper({
        sessionCookieValue: sessionCookieValue,
        keepAlive: false
    });

    for (let i = 0; i < profileLinks.length; i++) {
        await scraper.setup()
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
        fs.writeFileSync(path.join(__dirname, "profiles", `${link.substring(28)}.json`), JSON.stringify(profileJson));
    };
    // other actions...
    //await browser.close();
})();


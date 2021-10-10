const { LinkedInProfileScraper } = require('linkedin-profile-scraper');
const puppeteer = require('puppeteer');
const fs = require('fs');
//https://stackoverflow.com/questions/55678095/bypassing-captchas-with-headless-chrome-using-puppeteer
// Prepare the scraper
// Loading it in memory

(async () => {
    const maxPage = 1
    const browser = await puppeteer.launch({
        headless: false,
        channel: "chrome"
    });
    const page = await browser.newPage();
    await page.setCookie({
        url: "https://www.linkedin.com",
        name: 'li_at',
        value: ''
    })
    await page.goto('https://www.google.com/', { timeout: 60 * 1000 });
    await page.waitForSelector('input[name="q"]')
    await page.type('input[name="q"]', 'site:linkedin.com/in/ AND "python developer" AND "London"');
    await page.keyboard.press('Enter');
    const profileLinks = [];
    for (let i = 0; i < maxPage; i++) {
        await page.waitForSelector('a[href^="https://uk.linkedin.com/in/"]')
        profileLinks.push(...await page.$$eval('a[href^="https://uk.linkedin.com/in/"]', el => el.map(x => x.getAttribute("href"))));
        await page.click("#pnnext")

    }
    await browser.close();
    console.log(profileLinks.length)
    console.log(profileLinks)
    const scraper = new LinkedInProfileScraper({
        sessionCookieValue: '',
        keepAlive: false
    });
    await scraper.setup()
    for (let i = 0; i < profileLinks.length; i++) {
        let link = profileLinks[i];
        let profileJson = await getJsonProfile(link)
        fs.writeFile(`${link.substring(27)}.json`, JSON.stringify(profileJson));
    };
    // other actions...
    //await browser.close();
})();


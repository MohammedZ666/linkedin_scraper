const { LinkedInProfileScraper } = require('linkedin-profile-scraper');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const timeout = 2 * 60 * 1000;      //  request timeout       
const countryCode = "www";       //  two letter country code
const profileMaxCount = 500;     //  maximum number of profiles to scrape
const sessionCookieValue = 'AQEDATgnXHMEuXoKAAABfH3QYGwAAAF8odzkbFYAgoZPPttSKaskF117XMQHQ8a4D0A4gretGfh9i4-X_xfHLhxSDmsLXZh4wFNevKm0-oXBgwAdsS5At7-g6kVSiLyKUEvHOUPn6p1jNZVqPry--0xW';
const query = 'site:linkedin.com/in/ AND "Data Scientists" AND "United States"';

// Prepare the scraper
// Loading it in memory

// Software Engineer, Web developer, Recruiters, Data Scientists, Machine Learning Engineer, Human Resource Executive, Director, Legal Advisor, Information Security, Deputy Manager, App developer, Office Assistant, Librarian, Sales Manager, Graphic Designer, Product Manager, Public Relations Copywriter, SEO Brand Strategist, Marketing, DevOps Engineer, Network Administrator, Real Estate, Civil Engineer, Mechanical Engineer, Electrical Engineer, Chemical Engineer, Maintenance Engineer, Interior Designer, Medical Writer

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
        try {
            await page.waitForSelector(`a[href^="https://${countryCode}.linkedin.com/in/"]`)
            let currentLinks = await page.$$eval(`a[href^="https://${countryCode}.linkedin.com/in/"]`, el => el.map(x => x.getAttribute("href")))
            profileLinks.push(...currentLinks);
            profileScraped += currentLinks.length;
            await page.waitForSelector("#pnnext")
            //await sleepRandom()
            await page.click("#pnnext")
        } catch (error) {
            console.log("next google selector error", error)
            break;
        }
    }
    console.log("Total profiles scraped => ", profileScraped)
    //Deleting excess links
    // if (profileScraped > profileMaxCount) {
    //     let indexDelFrom = profileMaxCount
    //     profileLinks.splice(indexDelFrom)
    // }
    await browser.close();
    console.log("Total profiles demanded => ", profileMaxCount)
    console.log("Profile links => ", profileLinks)
    let scraper = new LinkedInProfileScraper({
        sessionCookieValue: sessionCookieValue,
        timeout: timeout,
        keepAlive: false
    });
    const saveDir = path.join(__dirname, "profiles", "")
    if (!fs.existsSync(saveDir)) {
        fs.mkdirSync('profiles', { recursive: true });
    }

    for (let i = 0; i < profileLinks.length; i++) {
        try {
            scraper = await scraperSetup(scraper);
            clearConsoleAndScrollbackBuffer();
            let link = profileLinks[i];
            link = link.replace(countryCode, "www")
            if (checkIfExists(link)) continue;
            let profileJson = await scraper.run(link)
            if (profileJson.userProfile.fullName === null) continue;
            fs.writeFileSync(`${saveDir}/${link.substring(28).replace("/", "")}.json`, JSON.stringify(profileJson, null, 2));
            console.log(`Scraper (run): Profiles saved at ${saveDir}`)


        } catch (error) {
            console.log(error)
            --i;
        }

        await sleepRandom()
    };
    // other actions...
    //await browser.close();
})();
const scraperSetup = async (scraper) => {
    await sleepRandom(20, 30)
    await scraper.setup()
    return scraper;
}
const getRandomArbitrary = (min, max) => {
    return parseInt(Math.random() * (max - min) + min);
}
const sleep = async (ms) => {
    return await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const sleepRandom = async (from, to) => {
    let ms = parseInt(getRandomArbitrary(from, to) * 1000);
    console.log(`Scraper run: Waiting for ${ms / 1000} seconds`)
    return await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const checkIfExists = (link) => {
    const saveDir = path.join(__dirname, "profiles", "")
    const dir = `${saveDir}/${link.substring(28).replace("/", "")}.json`
    if (fs.existsSync(dir)) {
        let profile = (JSON.parse(fs.readFileSync(dir, "utf8")))
        if (profile.userProfile.fullName !== null) {
            console.log(`profile of ${profile.userProfile.fullName} already exists .................. skipping ..................!`)
            return true;
        }
    }
    return false;
}

function clearConsoleAndScrollbackBuffer() {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
}
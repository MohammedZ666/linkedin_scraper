const { LinkedInProfileScraper } = require('linkedin-profile-scraper');
import { readFile } from 'fs/promises';

let profileLinks = (JSON.parse(await readFile("filename.json", "utf8"))).links;
// Plain Javascript
// const { LinkedInProfileScraper } = require('linkedin-profile-scraper')

(async () => {
    const scraper = new LinkedInProfileScraper({
        sessionCookieValue: '',
        keepAlive: false
    });

    // Prepare the scraper
    // Loading it in memory
    await scraper.setup()

    const result = await scraper.run("https://www.linkedin.com/in/terry-tsai-58890259/")
    fs.writeFileSync(`${saveDir}/${link.substring(28)}.json`, JSON.stringify(profileJson, null, 2));
    console.log(`Profiles saved at ${saveDir}`)
    console.log(result)
})()
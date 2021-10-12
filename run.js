const { LinkedInProfileScraper } = require('linkedin-profile-scraper');

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

    const result = await scraper.run('https://www.linkedin.com/in/gabrielaldana/')

    console.log(result)
})()
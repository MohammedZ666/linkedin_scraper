// Plain Javascript
const { LinkedInProfileScraper } = require('linkedin-profile-scraper');

(async () => {
    const scraper = new LinkedInProfileScraper({
        sessionCookieValue: 'li_at from cookies',
        keepAlive: false
    });

    // Prepare the scraper
    // Loading it in memory
    await scraper.setup()

    const result = await scraper.run('https://www.linkedin.com/in/md-abu-obaida-zishan/')

    console.log(result)
})()
// Plain Javascript
const { LinkedInProfileScraper } = require('linkedin-profile-scraper');

(async () => {
    const scraper = new LinkedInProfileScraper({
        sessionCookieValue: 'AQEDATVRtXUFNTdpAAABfAz7VgsAAAF8fV4gF00ADwKjzSgyoUSMirkJ_doPYxC0F-ifv8mcmhryDWLVxDc9haFhGQsOEa-VOo17bVN9rxyeu0_ca68PBuQ32LDL2DHlOe6zsgw9bJiNM5A5yeScjgZO',
        keepAlive: false
    });

    // Prepare the scraper
    // Loading it in memory
    await scraper.setup()

    const result = await scraper.run('https://www.linkedin.com/in/md-abu-obaida-zishan/')

    console.log(result)
})()
const { LinkedInProfileScraper } = require('linkedin-profile-scraper');

// Plain Javascript
// const { LinkedInProfileScraper } = require('linkedin-profile-scraper')

(async () => {
    const scraper = new LinkedInProfileScraper({
        sessionCookieValue: 'AQEDATgdkNUEKLlIAAABfHKZ3VUAAAF8lqZhVVYARKmilJUjZjvs31Z8NjbkglT5S9vS6rXs8y5hK_4w-XPJE7uY4ta1ERehuR3UEQRuo9ky0ovRNypghYqlOc0r2d2_rcxVOY0sTEjF9e6A-w1jnGGh',
        keepAlive: false
    });

    // Prepare the scraper
    // Loading it in memory
    await scraper.setup()

    const result = await scraper.run('https://www.linkedin.com/in/gabrielaldana/')

    console.log(result)
})()
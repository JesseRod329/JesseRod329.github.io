// Quick test script to verify Puppeteer works
import puppeteer from 'puppeteer';

console.log('Testing Puppeteer installation...');

(async () => {
    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            timeout: 10000
        });
        console.log('✅ Browser launched successfully');
        
        const page = await browser.newPage();
        console.log('✅ Page created');
        
        console.log('Testing navigation...');
        await page.goto('https://www.google.com', { 
            waitUntil: 'domcontentloaded', 
            timeout: 10000 
        });
        console.log('✅ Navigation successful');
        
        const title = await page.title();
        console.log(`✅ Page title: ${title}`);
        
        await browser.close();
        console.log('\n✅ Puppeteer is working correctly!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (browser) {
            await browser.close();
        }
        process.exit(1);
    }
})();


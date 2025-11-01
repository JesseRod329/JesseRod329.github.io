import puppeteer from 'puppeteer';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data storage
const ratingsData = {
    WWE: [],
    AEW: [],
    TNA: []
};

// Helper function to parse viewer numbers
function parseViewers(text) {
    if (!text) return null;
    // Remove commas, extract numbers
    const cleaned = text.toString().replace(/,/g, '').replace(/[^\d.]/g, '');
    const match = cleaned.match(/(\d+(?:\.\d+)?)/);
    if (match) {
        const num = parseFloat(match[1]);
        // Convert to thousands if > 1000
        return num > 1000 ? Math.round(num / 1000) : Math.round(num);
    }
    return null;
}

// Helper function to parse date
function parseDate(dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        return date;
    }
    return null;
}

// Get week start date (Monday)
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

// Fetch HTML content
function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        protocol.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Retry helper function
async function retryOperation(operation, maxRetries = 3, delay = 2000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            console.log(`Retry ${i + 1}/${maxRetries} after error: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Scrape POST Wrestling using their tag pages
async function scrapePOSTWrestling() {
    console.log('Scraping POST Wrestling...');
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: 'new',
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-features=IsolateOrigins,site-per-process'
            ],
            timeout: 30000
        });
        const page = await browser.newPage();
        
        // Set realistic user agent
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Set default timeout
        page.setDefaultTimeout(30000);
        page.setDefaultNavigationTimeout(30000);
        
        // POST Wrestling has monthly breakdowns
        const baseUrl = 'https://www.postwrestling.com';
        
        // Search for ratings articles
        const searchUrl = `${baseUrl}/tag/tv-ratings/`;
        console.log(`Accessing ${searchUrl}...`);
        
        await retryOperation(async () => {
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        });
        await page.waitForTimeout(2000);
        
        // Extract article links
        const articles = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href*="ratings"], a[href*="viewership"]'));
            return links
                .filter(link => {
                    const text = link.textContent.toLowerCase();
                    return (text.includes('ratings') || text.includes('viewership')) &&
                           (text.includes('wwe') || text.includes('aew') || text.includes('tna'));
                })
                .slice(0, 20) // Limit to 20 most relevant
                .map(link => ({
                    title: link.textContent.trim(),
                    href: link.href
                }));
        });
        
        console.log(`Found ${articles.length} potential articles`);
        
        // Process each article
        for (let i = 0; i < Math.min(articles.length, 15); i++) {
            const article = articles[i];
            try {
                console.log(`Processing ${i + 1}/${Math.min(articles.length, 15)}: ${article.title}`);
                await retryOperation(async () => {
                    await page.goto(article.href, { waitUntil: 'domcontentloaded', timeout: 30000 });
                }, 2, 1000);
                await page.waitForTimeout(1500);
                
                const articleData = await page.evaluate(() => {
                    // Try to find date in article
                    const dateEl = document.querySelector('time, .date, [class*="date"]');
                    const dateText = dateEl ? dateEl.textContent : '';
                    
                    // Get all text content
                    const content = document.body.innerText;
                    
                    return { dateText, content };
                });
                
                // Extract ratings from content
                extractRatingsFromText(articleData.content, articleData.dateText);
                
                await page.waitForTimeout(1000); // Rate limiting
            } catch (err) {
                console.error(`Error processing article ${article.href}:`, err.message);
                continue; // Skip to next article
            }
        }
    } catch (error) {
        console.error('Error scraping POST Wrestling:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Extract ratings from text content with improved patterns
function extractRatingsFromText(text, dateHint = '') {
    // Extract year from date hint or use current year
    const currentYear = new Date().getFullYear();
    let year = currentYear;
    let month = new Date().getMonth() + 1;
    
    if (dateHint) {
        const yearMatch = dateHint.match(/(\d{4})/);
        if (yearMatch) year = parseInt(yearMatch[1]);
        
        const monthMatch = dateHint.match(/(january|february|march|april|may|june|july|august|september|october|november|december)/i);
        if (monthMatch) {
            const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                              'july', 'august', 'september', 'october', 'november', 'december'];
            month = monthNames.indexOf(monthMatch[1].toLowerCase()) + 1;
        }
    }
    
    // Improved patterns for WWE Raw
    const rawPatterns = [
        /(?:WWE\s+)?Raw[:\s]+(?:(\d{1,2})\/(\d{1,2})\/(\d{2,4}))?[:\s]+(?:(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers|,|\s))/gi,
        /Raw[:\s]+(?:(\d{1,2})\/(\d{1,2}))?[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k)/gi,
        /Raw[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers)/gi,
    ];
    
    // Improved patterns for WWE SmackDown
    const smackdownPatterns = [
        /(?:WWE\s+)?SmackDown[:\s]+(?:(\d{1,2})\/(\d{1,2})\/(\d{2,4}))?[:\s]+(?:(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers|,|\s))/gi,
        /SmackDown[:\s]+(?:(\d{1,2})\/(\d{1,2}))?[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k)/gi,
        /SmackDown[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers)/gi,
    ];
    
    // AEW Dynamite patterns
    const dynamitePatterns = [
        /(?:AEW\s+)?Dynamite[:\s]+(?:(\d{1,2})\/(\d{1,2})\/(\d{2,4}))?[:\s]+(?:(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers|,|\s))/gi,
        /Dynamite[:\s]+(?:(\d{1,2})\/(\d{1,2}))?[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k)/gi,
        /Dynamite[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers)/gi,
    ];
    
    // AEW Collision patterns
    const collisionPatterns = [
        /(?:AEW\s+)?Collision[:\s]+(?:(\d{1,2})\/(\d{1,2})\/(\d{2,4}))?[:\s]+(?:(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers|,|\s))/gi,
        /Collision[:\s]+(?:(\d{1,2})\/(\d{1,2}))?[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k)/gi,
        /Collision[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers)/gi,
    ];
    
    // TNA/Impact patterns
    const tnaPatterns = [
        /(?:TNA|Impact)[:\s]+(?:(\d{1,2})\/(\d{1,2})\/(\d{2,4}))?[:\s]+(?:(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers|,|\s))/gi,
        /(?:TNA|Impact)[:\s]+(?:(\d{1,2})\/(\d{1,2}))?[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k)/gi,
        /(?:TNA|Impact)[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers)/gi,
    ];
    
    // Extract WWE Raw
    extractShowRatings(text, rawPatterns, 'WWE Raw', year, month, ratingsData.WWE);
    
    // Extract WWE SmackDown
    extractShowRatings(text, smackdownPatterns, 'WWE SmackDown', year, month, ratingsData.WWE);
    
    // Extract AEW Dynamite
    extractShowRatings(text, dynamitePatterns, 'AEW Dynamite', year, month, ratingsData.AEW);
    
    // Extract AEW Collision
    extractShowRatings(text, collisionPatterns, 'AEW Collision', year, month, ratingsData.AEW);
    
    // Extract TNA
    extractShowRatings(text, tnaPatterns, 'TNA Impact', year, month, ratingsData.TNA);
}

// Extract ratings for a specific show using multiple patterns
function extractShowRatings(text, patterns, showName, year, month, targetArray) {
    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            let day = 1;
            let viewers = null;
            
            // Try to extract date
            if (match[1] && match[2]) {
                day = parseInt(match[1]);
                const monthDay = parseInt(match[2]);
                if (monthDay && monthDay <= 12) {
                    month = monthDay;
                }
            }
            
            // Extract viewers
            const viewerMatch = match[match.length - 1] || match[3] || match[2];
            viewers = parseViewers(viewerMatch);
            
            if (viewers && viewers > 0) {
                const date = new Date(year, month - 1, day || 1);
                if (!isNaN(date.getTime())) {
                    targetArray.push({ date, viewers, show: showName });
                }
            }
        }
    }
}

// Scrape Gerweck.net for TNA data
async function scrapeGerweck() {
    console.log('Scraping Gerweck.net for TNA data...');
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: 'new',
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-features=IsolateOrigins,site-per-process'
            ],
            timeout: 30000
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Set default timeout
        page.setDefaultTimeout(30000);
        page.setDefaultNavigationTimeout(30000);
        
        const urls = [
            'https://gerweck.net/tv-ratings/2024-tv-ratings/',
            'https://gerweck.net/tv-ratings/2023-tv-ratings/',
        ];
        
        for (const url of urls) {
            try {
                console.log(`Accessing ${url}...`);
                await retryOperation(async () => {
                    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
                });
                await page.waitForTimeout(1500);
                
                const content = await page.evaluate(() => {
                    return document.body.innerText;
                });
                
                const year = url.includes('2024') ? 2024 : 2023;
                extractRatingsFromText(content, `${year}`);
                
                await page.waitForTimeout(1000);
            } catch (err) {
                console.error(`Error scraping ${url}:`, err.message);
                continue; // Skip to next URL
            }
        }
    } catch (error) {
        console.error('Error scraping Gerweck:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Main scraping function
async function scrapeAllSources() {
    console.log('Starting scraping process...');
    console.log('Note: This may take several minutes...\n');
    
    // Add process error handlers
    process.on('unhandledRejection', (error) => {
        console.error('Unhandled rejection:', error);
        process.exit(1);
    });
    
    process.on('SIGINT', () => {
        console.log('\n\nScraping interrupted by user');
        process.exit(0);
    });
    
    try {
        await scrapePOSTWrestling();
        await scrapeGerweck();
        
        console.log('\n=== Scraping Results ===');
        console.log(`WWE entries: ${ratingsData.WWE.length}`);
        console.log(`AEW entries: ${ratingsData.AEW.length}`);
        console.log(`TNA entries: ${ratingsData.TNA.length}`);
        
        // Save raw data
        const outputPath = join(__dirname, 'scraped-data.json');
        fs.writeFileSync(outputPath, JSON.stringify(ratingsData, null, 2));
        console.log(`\nRaw data saved to ${outputPath}`);
        
        console.log('\nNext step: Run "node process-data.js" to process and format the data');
        
    } catch (error) {
        console.error('Error in scraping process:', error);
    }
}

// Run scraper
scrapeAllSources();



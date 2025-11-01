#!/usr/bin/env node
// Simplified scraper with better error handling and progress output
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
    const cleaned = text.toString().replace(/,/g, '').replace(/[^\d.]/g, '');
    const match = cleaned.match(/(\d+(?:\.\d+)?)/);
    if (match) {
        const num = parseFloat(match[1]);
        return num > 1000 ? Math.round(num / 1000) : Math.round(num);
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

// Extract ratings from text content
function extractRatingsFromText(text, dateHint = '') {
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
    
    // Simple patterns for ratings
    const patterns = {
        raw: /Raw[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers)/gi,
        smackdown: /SmackDown[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers)/gi,
        dynamite: /Dynamite[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers)/gi,
        collision: /Collision[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers)/gi,
        tna: /(?:TNA|Impact)[:\s]+(\d{1,3}(?:,\d{3})*)\s*(?:thousand|k|viewers)/gi,
    };
    
    Object.entries(patterns).forEach(([key, pattern]) => {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const viewers = parseViewers(match[1]);
            if (viewers && viewers > 0) {
                const date = new Date(year, month - 1, 1);
                if (key === 'raw' || key === 'smackdown') {
                    ratingsData.WWE.push({ date, viewers, show: `WWE ${key}` });
                } else if (key === 'dynamite' || key === 'collision') {
                    ratingsData.AEW.push({ date, viewers, show: `AEW ${key}` });
                } else if (key === 'tna') {
                    ratingsData.TNA.push({ date, viewers, show: 'TNA Impact' });
                }
            }
        }
    });
}

// Main scraping function
async function scrapeAllSources() {
    console.log('Starting scraping process...');
    console.log('Note: This may take several minutes...\n');
    
    process.on('SIGINT', () => {
        console.log('\n\nScraping interrupted by user');
        process.exit(0);
    });
    
    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            timeout: 30000
        });
        
        const page = await browser.newPage();
        page.setDefaultTimeout(20000);
        page.setDefaultNavigationTimeout(20000);
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
        
        console.log('Accessing POST Wrestling...');
        try {
            await page.goto('https://www.postwrestling.com/tag/tv-ratings/', { 
                waitUntil: 'domcontentloaded', 
                timeout: 20000 
            });
            await page.waitForTimeout(2000);
            
            const content = await page.evaluate(() => document.body.innerText);
            extractRatingsFromText(content);
            console.log(`✅ POST Wrestling processed`);
        } catch (err) {
            console.error(`⚠️  Error with POST Wrestling: ${err.message}`);
        }
        
        console.log('Accessing Gerweck.net...');
        try {
            await page.goto('https://gerweck.net/tv-ratings/2024-tv-ratings/', { 
                waitUntil: 'domcontentloaded', 
                timeout: 20000 
            });
            await page.waitForTimeout(2000);
            
            const content = await page.evaluate(() => document.body.innerText);
            extractRatingsFromText(content, '2024');
            console.log(`✅ Gerweck.net 2024 processed`);
        } catch (err) {
            console.error(`⚠️  Error with Gerweck 2024: ${err.message}`);
        }
        
    } catch (error) {
        console.error('Error in scraping process:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    
    console.log('\n=== Scraping Results ===');
    console.log(`WWE entries: ${ratingsData.WWE.length}`);
    console.log(`AEW entries: ${ratingsData.AEW.length}`);
    console.log(`TNA entries: ${ratingsData.TNA.length}`);
    
    // Save raw data
    const outputPath = join(__dirname, 'scraped-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(ratingsData, null, 2));
    console.log(`\nRaw data saved to ${outputPath}`);
    
    console.log('\nNext step: Run "node process-data.js" to process and format the data');
}

// Run scraper
scrapeAllSources().catch(console.error);


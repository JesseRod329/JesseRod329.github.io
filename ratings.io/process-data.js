import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load scraped data
let scrapedData = {};
try {
    const dataFile = fs.readFileSync(join(__dirname, 'scraped-data.json'), 'utf8');
    scrapedData = JSON.parse(dataFile);
    
    // Convert date strings back to Date objects if needed
    if (scrapedData.WWE && scrapedData.WWE.length > 0 && typeof scrapedData.WWE[0].date === 'string') {
        scrapedData.WWE = scrapedData.WWE.map(entry => ({
            ...entry,
            date: new Date(entry.date)
        }));
    }
    if (scrapedData.AEW && scrapedData.AEW.length > 0 && typeof scrapedData.AEW[0].date === 'string') {
        scrapedData.AEW = scrapedData.AEW.map(entry => ({
            ...entry,
            date: new Date(entry.date)
        }));
    }
    if (scrapedData.TNA && scrapedData.TNA.length > 0 && typeof scrapedData.TNA[0].date === 'string') {
        scrapedData.TNA = scrapedData.TNA.map(entry => ({
            ...entry,
            date: new Date(entry.date)
        }));
    }
} catch (error) {
    console.error('No scraped data found. Please run scraper.js first.');
    console.error('Creating empty data structure...');
    scrapedData = { WWE: [], AEW: [], TNA: [] };
}

// Get week start (Monday)
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

// Convert date string to Date object
function parseDate(dateStr) {
    if (typeof dateStr === 'string') {
        return new Date(dateStr);
    }
    return new Date(dateStr);
}

// Aggregate data by week
function aggregateWeeklyData() {
    const weeklyData = {};
    const today = new Date();
    
    // Initialize 52 weeks
    for (let i = 51; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (i * 7));
        const weekStart = getWeekStart(date);
        const weekKey = weekStart.toISOString().split('T')[0];
        
        weeklyData[weekKey] = {
            date: weekStart.toISOString().split('T')[0],
            dateFormatted: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            WWE: 0,
            AEW: 0,
            TNA: 0,
            WWE_count: 0,
            AEW_count: 0,
            TNA_count: 0
        };
    }
    
    // Aggregate WWE data
    scrapedData.WWE.forEach(entry => {
        const date = parseDate(entry.date);
        const weekStart = getWeekStart(date);
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (weeklyData[weekKey]) {
            weeklyData[weekKey].WWE += entry.viewers;
            weeklyData[weekKey].WWE_count++;
        }
    });
    
    // Aggregate AEW data
    scrapedData.AEW.forEach(entry => {
        const date = parseDate(entry.date);
        const weekStart = getWeekStart(date);
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (weeklyData[weekKey]) {
            weeklyData[weekKey].AEW += entry.viewers;
            weeklyData[weekKey].AEW_count++;
        }
    });
    
    // Aggregate TNA data
    scrapedData.TNA.forEach(entry => {
        const date = parseDate(entry.date);
        const weekStart = getWeekStart(date);
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (weeklyData[weekKey]) {
            weeklyData[weekKey].TNA += entry.viewers;
            weeklyData[weekKey].TNA_count++;
        }
    });
    
    // Calculate averages and clean up
    const result = Object.values(weeklyData).map(week => {
        const wwe = week.WWE_count > 0 ? Math.round(week.WWE / week.WWE_count) : 0;
        const aew = week.AEW_count > 0 ? Math.round(week.AEW / week.AEW_count) : 0;
        const tna = week.TNA_count > 0 ? Math.round(week.TNA / week.TNA_count) : 0;
        
        return {
            date: week.date,
            dateFormatted: week.dateFormatted,
            WWE: wwe,
            AEW: aew,
            TNA: tna
        };
    });
    
    return result;
}

// Process and output data
const processedData = aggregateWeeklyData();

// Generate JavaScript file content
const jsContent = `// Real wrestling ratings data - Last 52 weeks
// Generated from scraped cable viewership data
// Data source: Various wrestling ratings websites
// Run "node scraper.js" then "node process-data.js" to update

const ratingsData = ${JSON.stringify(processedData, null, 2)};
`;

// Write to data.js
const outputPath = join(__dirname, 'data.js');
fs.writeFileSync(outputPath, jsContent);
console.log(`\nProcessed data written to ${outputPath}`);
console.log(`Total weeks: ${processedData.length}`);
console.log(`WWE entries: ${processedData.filter(d => d.WWE > 0).length}`);
console.log(`AEW entries: ${processedData.filter(d => d.AEW > 0).length}`);
console.log(`TNA entries: ${processedData.filter(d => d.TNA > 0).length}`);
console.log('\n✅ Data ready! Open index.html in your browser to view the ratings.');


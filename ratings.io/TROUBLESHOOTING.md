# Troubleshooting Scraper Issues

## "Socket Hang Up" Errors

If you're seeing "socket hang up" errors, this usually means:
1. **Network connectivity issues** - Check your internet connection
2. **Sites blocking automated requests** - Some sites detect and block bots
3. **Firewall/VPN issues** - Corporate networks or VPNs may block Puppeteer
4. **Rate limiting** - Sites may temporarily block too many requests

## Solutions

### Option 1: Check Network Connection
```bash
# Test if sites are accessible
curl -I https://www.postwrestling.com
curl -I https://gerweck.net
```

### Option 2: Try Running with Visible Browser
Edit `scraper.js` and change `headless: 'new'` to `headless: false` to see what's happening:
```javascript
browser = await puppeteer.launch({ 
    headless: false,  // Shows browser window
    ...
});
```

### Option 3: Use Alternative Data Sources
If scraping isn't working, you can:
1. Manually add data to `scraped-data.json`
2. Use the mock data generator (already works)
3. Try running scraper at different times (sites may have rate limits)

### Option 4: Check Puppeteer Installation
```bash
cd /Users/jesse/JesseRod329.github.io/ratings.io
node -e "import('puppeteer').then(p => console.log('✅ Puppeteer:', p.version))"
```

## Current Status

The scraper now has:
- ✅ Retry logic (3 attempts with delays)
- ✅ Better error handling
- ✅ Improved browser flags
- ✅ Proper cleanup on errors

If scraping still fails, the website will use generated mock data which is already functional.


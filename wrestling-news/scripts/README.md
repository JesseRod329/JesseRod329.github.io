# 📰 Wrestling News Aggregation Scripts

This directory contains the automated news aggregation system for the Wrestling News Hub.

## 🚀 Quick Start

### Local Testing
```bash
# Install dependencies
pip install -r requirements.txt

# Test the news aggregator
python test-news.py

# Run full news update
python update-news.py
```

### GitHub Actions
The news aggregation runs automatically via GitHub Actions:
- **Schedule**: Every 6 hours
- **Manual trigger**: Available in GitHub Actions tab
- **Auto-commit**: Updates are automatically committed to the repository

## 📁 Files

- `update-news.py` - Main news aggregation script
- `test-news.py` - Local testing script
- `requirements.txt` - Python dependencies
- `README.md` - This documentation

## 🔧 How It Works

### 1. RSS Feed Sources
The script fetches news from multiple wrestling RSS feeds:
- WWE.com official news
- PWInsider.com
- Fightful.com
- WrestlingInc.com
- CagesideSeats.com
- Bleacher Report Wrestling
- Sportskeeda Wrestling
- WrestlingNews.co

### 2. News Categorization
Articles are automatically categorized as Raw or SmackDown based on:
- **Raw keywords**: "raw", "monday night raw", "raw results", etc.
- **SmackDown keywords**: "smackdown", "friday night smackdown", "smackdown results", etc.
- **General wrestling**: Falls back to random assignment if unclear

### 3. Data Processing
- Cleans HTML from article content
- Extracts meaningful summaries
- Handles publication dates
- Limits to 20 articles per category
- Sorts by publication date (newest first)

### 4. Output
Updates two JSON files:
- `data/raw-news.json` - Raw news articles
- `data/smackdown-news.json` - SmackDown news articles

## 🛠️ Customization

### Adding New RSS Feeds
Edit the `feeds` dictionary in `update-news.py`:

```python
self.feeds = {
    'new_source': 'https://example.com/rss.xml',
    # ... existing feeds
}
```

### Modifying Keywords
Update the keyword lists for better categorization:

```python
self.raw_keywords = [
    'raw', 'monday night raw', 'your_new_keyword',
    # ... existing keywords
]
```

### Changing Update Frequency
Edit `.github/workflows/update-news.yml`:

```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
  # Change to '0 0 * * *' for daily updates
```

## 🐛 Troubleshooting

### Common Issues

1. **RSS feeds not loading**
   - Check if the feed URL is still valid
   - Some sites may block automated requests
   - Try running the test script to debug

2. **Articles not categorizing correctly**
   - Add more keywords to the keyword lists
   - Check the text being analyzed in the test output

3. **GitHub Actions failing**
   - Check the Actions tab for error logs
   - Ensure the repository has the correct permissions
   - Verify the Python dependencies are up to date

### Debug Mode
Run the test script to see detailed output:

```bash
python test-news.py
```

This will show:
- Which feeds are working
- How articles are being categorized
- Sample processed articles
- Error messages for failed feeds

## 📊 Monitoring

### GitHub Actions
- Go to your repository's "Actions" tab
- View the "Update Wrestling News" workflow
- Check logs for any errors or issues

### Local Monitoring
- Check the `data/` directory for updated JSON files
- Verify article counts and content quality
- Test the website to ensure news is displaying correctly

## 🔒 Security Notes

- The script only reads public RSS feeds
- No authentication or API keys required
- All data is publicly available wrestling news
- GitHub Actions runs with read-only permissions by default

## 📈 Performance

- Processes ~10 articles per feed (max 20 per category)
- Respects server resources with delays between requests
- Runs every 6 hours to balance freshness vs. server load
- Total runtime: ~2-3 minutes per update cycle

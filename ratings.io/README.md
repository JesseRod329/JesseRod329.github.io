# Wrestling Ratings Tracker

Interactive website displaying 52 weeks of cable viewership data for WWE, AEW, and TNA shows.

## Features

- **Interactive Chart**: Line chart showing viewership trends over 52 weeks
- **Data Table**: Complete weekly breakdown of all ratings
- **Filterable**: Filter by show (WWE, AEW, TNA, or All)
- **Statistics**: Average viewership for each promotion
- **Real Data**: Scraped from reliable wrestling ratings sources

## Setup

1. Install dependencies:
```bash
npm install
```

2. Scrape ratings data:
```bash
node scraper.js
```

3. Process the scraped data:
```bash
node process-data.js
```

4. Open `index.html` in your browser to view the ratings.

## Data Sources

The scraper collects data from:
- POST Wrestling (monthly ratings breakdowns)
- Gerweck.net (TNA/Impact ratings)
- Other wrestling news sources

## Data Format

The data is stored in `data.js` with the following structure:
```javascript
const ratingsData = [
  {
    date: "2024-01-01",
    dateFormatted: "Jan 1, 2024",
    WWE: 1650,  // in thousands
    AEW: 800,   // in thousands
    TNA: 90     // in thousands
  },
  // ... 52 weeks total
];
```

## Notes

- Data is cable-only (excludes streaming numbers)
- Ratings are aggregated weekly (Monday-Sunday)
- WWE combines Raw and SmackDown averages
- AEW combines Dynamite and Collision averages
- Missing weeks may show as 0

## Updating Data

To refresh with latest ratings:
1. Run `node scraper.js` to fetch new data
2. Run `node process-data.js` to process and update `data.js`
3. Refresh the browser to see updated charts


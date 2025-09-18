# 🏆 Wrestling Match History Database

A beautiful, modern web interface for exploring comprehensive wrestling match histories from your CSV data collection.

## 📊 Database Statistics
- **595 Wrestlers** with complete match histories
- **703,580+ Total Matches** across all wrestlers
- **1,182 Average Matches** per wrestler
- Data from multiple wrestling promotions and eras

## 🚀 Quick Start

### Option 1: Run the Web Server (Recommended)
```bash
# Start the local web server
python3 server.py
```
Then open http://localhost:8000 in your browser.

### Option 2: Open Directly in Browser
Simply open `index.html` in your web browser (some features may be limited).

## 📁 Project Structure
```
/WSTATS/
├── index.html              # Main website
├── server.py              # Local web server
├── process_csv_data.py    # Data processing script
├── wrestling_data.json    # Processed wrestler data
├── README.md              # This file
└── cagematch_scrapper/    # Your original CSV files
    ├── John_Cena_matches.csv
    ├── The_Rock_matches.csv
    └── ... (595+ more files)
```

## ✨ Features

### 🔍 Search & Filter
- **Real-time search** by wrestler name
- **Sort by match count** to see most active wrestlers
- **Responsive design** works on all devices

### 📈 Statistics Dashboard
- Total wrestlers and matches
- Average matches per wrestler
- Recent activity (2025 matches)
- Top 10 most active wrestlers

### 🎯 Match Details
- **Complete match histories** for each wrestler
- **Match results, dates, and events**
- **Expandable match details**
- **Clean, readable format**

### 🎨 Modern UI
- **Beautiful gradient design**
- **Smooth animations and hover effects**
- **Card-based layout**
- **Professional typography**

## 🛠️ Scripts

### Process CSV Data
If you add new CSV files, re-run the processing script:
```bash
python3 process_csv_data.py
```

### Start Web Server
```bash
python3 server.py
```

## 📱 Mobile Friendly
The site is fully responsive and works great on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktop computers

## 🔧 Technical Details
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Data Processing**: Python 3
- **Styling**: Modern CSS with gradients and animations
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Roboto)

## 🎮 Usage Tips
1. **Search**: Type any wrestler's name in the search box
2. **Sort**: Click "Sort by Matches" to see most active wrestlers first
3. **View Details**: Click "View All Matches" to see complete history
4. **Statistics**: Click the chart icon for detailed database stats

## 📝 Data Source
Match data sourced from Cagematch.net and processed into CSV format. Each wrestler's complete professional wrestling career is documented with match results, dates, promotions, and event details.

---

**Enjoy exploring the world of professional wrestling!** 🤼‍♂️💪

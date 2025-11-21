# IPTV Web Application

A comprehensive IPTV web application for viewing live TV channels on your Mac. Features include playlist management, EPG (Electronic Program Guide), favorites, search, and VLC integration.

## Features

- **Channel Playback**: HTML5 video player with VLC fallback option
- **Playlist Management**: Import playlists from iptv-org or custom M3U files
- **EPG Support**: Electronic Program Guide with current and upcoming programs
- **Favorites**: Save your favorite channels for quick access
- **Search & Filter**: Search channels by name, filter by category and country
- **Modern UI**: Clean, responsive interface with dark/light theme support

## Architecture

- **Frontend**: HTML/JavaScript web application
- **Backend**: Python Flask REST API
- **Database**: SQLite (separate databases for dev/test/prod)

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- VLC Media Player (optional, for VLC integration)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Mac/Linux
# or
venv\Scripts\activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set environment (optional, defaults to dev):
```bash
export ENVIRONMENT=dev  # or test, prod
```

5. Run the Flask server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Open the frontend directory in your browser or use a local server:

**Option 1: Simple HTTP Server (Python)**
```bash
cd frontend
python3 -m http.server 8000 --bind 0.0.0.0
```
Note: The `--bind 0.0.0.0` flag makes the server accessible from other devices on your network (required for iPhone access).

**Option 2: Using Node.js http-server**
```bash
npx http-server frontend -p 8000
```

2. Open your browser and navigate to:
```
http://localhost:8000
```

### Initial Setup

1. **Fetch Playlist**: Click "Fetch IPTV-org Playlist" to import channels from iptv-org
2. **Fetch EPG**: Navigate to "Program Guide" and click "Fetch EPG Data" to load program schedules
3. **Start Watching**: Click on any channel to start playback

## Usage

### Playing Channels

1. Browse channels in the main view
2. Click on any channel card to start playback
3. Use the HTML5 video controls to pause, adjust volume, etc.
4. Click "Open in VLC" to launch the stream in VLC Media Player

### Managing Favorites

1. Click the star icon (⭐) on a channel card or in the player
2. Access favorites from the sidebar navigation
3. Click on a favorite channel to play it

### Searching Channels

1. Use the search box in the sidebar to search by channel name
2. Use category and country filters to narrow down results
3. Filters can be combined for more specific results

### EPG (Electronic Program Guide)

1. Navigate to "Program Guide" in the sidebar
2. Click "Fetch EPG Data" to load program schedules
3. Select a channel from the filter dropdown to view its schedule
4. Click on a program to see details

### Importing Custom Playlists

1. Click "Import Custom Playlist" in the sidebar
2. Enter a playlist URL or upload an M3U file
3. Channels will be imported and available immediately

## Mobile Access (iPhone/iPad)

You can access the IPTV application from your iPhone or iPad (or any device) on the same WiFi network.

### Setup Steps

1. **Find your Mac's IP address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   Look for an IP address like `192.168.1.100` or `10.0.0.5` (your actual IP will vary).

2. **Start the servers** (if not already running):
   ```bash
   # Terminal 1: Backend
   cd backend
   source venv/bin/activate
   PORT=5001 python app.py
   
   # Terminal 2: Frontend (bind to all interfaces for network access)
   cd frontend
   python3 -m http.server 8000 --bind 0.0.0.0
   ```

3. **On your iPhone:**
   - Open Safari (or any browser)
   - Navigate to: `http://YOUR_MAC_IP:8000`
     - Example: `http://192.168.1.100:8000`
   - The app should load

4. **Configure API URL on iPhone:**
   - Click the settings icon (⚙️) in the header
   - Update "API Base URL" to: `http://YOUR_MAC_IP:5001/api`
     - Example: `http://192.168.1.100:5001/api`
   - Changes are saved automatically

### Security Note

⚠️ **Important**: When accessible on your local network, any device connected to the same WiFi network can access the application. This is fine for home networks, but be cautious on public or shared networks.

## Configuration

### API Base URL

The default API URL is `http://localhost:5000/api`. To change it:

1. Click the settings icon (⚙️) in the header
2. Update the "API Base URL" field
3. Changes are saved automatically

### Environment Variables

- `ENVIRONMENT`: Set to `dev`, `test`, or `prod` (default: `dev`)
- `PORT`: Flask server port (default: `5000`)
- `SECRET_KEY`: Flask secret key (default: dev key, change in production)

## Project Structure

```
iptv/
├── backend/
│   ├── app.py              # Flask application
│   ├── config.py           # Configuration management
│   ├── database.py         # Database models and operations
│   ├── playlist_parser.py  # M3U playlist parsing
│   ├── epg_fetcher.py     # EPG data fetching
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── app.js             # Main application logic
│   ├── player.js          # Video player management
│   ├── playlist.js        # Playlist management
│   ├── epg.js             # EPG functionality
│   ├── favorites.js       # Favorites management
│   ├── search.js          # Search functionality
│   └── styles.css         # Styling
├── database/
│   ├── dev.db            # Development database
│   ├── test.db           # Test database
│   └── prod.db           # Production database
└── README.md
```

## API Endpoints

### Channels
- `GET /api/channels` - Get all channels (with optional filters)
- `GET /api/channels/<id>` - Get specific channel
- `POST /api/channels/<id>/play` - Record playback

### Playlists
- `POST /api/playlists/fetch` - Fetch and import playlist from URL
- `GET /api/playlists/custom` - Get custom playlists
- `POST /api/playlists/custom` - Save custom playlist

### Favorites
- `GET /api/favorites` - Get all favorites
- `POST /api/favorites` - Add favorite
- `DELETE /api/favorites/<id>` - Remove favorite

### EPG
- `GET /api/epg/<channel_id>` - Get EPG for channel
- `POST /api/epg/fetch` - Fetch EPG data from source

### Metadata
- `GET /api/categories` - Get all categories
- `GET /api/countries` - Get all countries
- `GET /api/health` - Health check

## VLC Integration

The application supports opening streams in VLC Media Player:

1. Click "Open in VLC" button in the player
2. The application will attempt to open the stream using the `vlc://` protocol
3. If VLC is not installed or the protocol handler fails, you'll be prompted with instructions
4. You can manually copy the stream URL and paste it in VLC: File > Open Network Stream

## Troubleshooting

### Backend won't start
- Make sure Python 3.8+ is installed
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Verify the port (5000) is not already in use

### Channels won't play
- Check that the stream URL is valid and accessible
- Some streams may require CORS headers or authentication
- Try opening in VLC instead using the "Open in VLC" button

### EPG data not loading
- Make sure you've fetched EPG data first (click "Fetch EPG Data")
- Verify the EPG source URL is accessible
- Check browser console for errors

### CORS errors
- Make sure the backend CORS configuration includes your frontend URL
- Check that both frontend and backend are running

## Development

### Running Tests

Set environment to test:
```bash
export ENVIRONMENT=test
python app.py
```

### Database

The application uses SQLite databases stored in the `database/` directory. Separate databases are used for dev, test, and prod environments.

To reset the database, delete the corresponding `.db` file and restart the application.

## License

This project is provided as-is for personal use.

## Acknowledgments

- Uses playlists from [iptv-org/iptv](https://github.com/iptv-org/iptv)
- EPG data can be fetched from various XMLTV sources








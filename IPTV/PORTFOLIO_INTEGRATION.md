# IPTV Player - Portfolio Integration

## Project Overview

**IPTV Player** is a comprehensive web application for viewing live TV channels with advanced features including:
- Multi-view picture-in-picture support
- Local channel filtering by zip code
- EPG (Electronic Program Guide) integration
- Favorites and recently watched channels
- Password-protected access
- Mobile-optimized interface

## Live Demo

- **Frontend**: Accessible on local network at `http://YOUR_IP:8000`
- **Backend API**: Running on `http://YOUR_IP:5001/api`
- **Password**: Set via `IPTV_PASSWORD` environment variable (default: 12345678)

## Technology Stack

- **Frontend**: HTML5, JavaScript (ES6+), CSS3
- **Backend**: Python Flask REST API
- **Database**: SQLite
- **Video**: HTML5 Video Player with HLS.js support
- **EPG**: XMLTV format with iris.digital integration

## Key Features

### 🎬 Multi-View
- Drag and drop channels into multi-view slots
- Picture-in-picture viewing
- Context menu integration

### 📍 Local Channels
- Filter by zip code
- Automatic local network detection
- US channel lineup support

### 📅 EPG Guide
- Real-time program schedules
- Current and upcoming programs
- Channel-specific EPG data

### ⭐ Favorites & Recent
- Quick access to favorite channels
- Recently watched history
- Persistent storage

### 🔒 Security
- Password-protected access
- Session-based authentication
- Secure API endpoints

## Server Setup (Always Running)

The server is configured to run continuously using macOS `launchd`:

### Installation

1. **Backend Server** (Port 5001):
   ```bash
   # Copy plist file
   cp com.jesse.iptv-server.plist ~/Library/LaunchAgents/
   
   # Load the service
   launchctl load ~/Library/LaunchAgents/com.jesse.iptv-server.plist
   ```

2. **Frontend Server** (Port 8000):
   ```bash
   # Copy plist file
   cp com.jesse.iptv-frontend.plist ~/Library/LaunchAgents/
   
   # Load the service
   launchctl load ~/Library/LaunchAgents/com.jesse.iptv-frontend.plist
   ```

### Management

- **Start**: `launchctl start com.jesse.iptv-server` / `launchctl start com.jesse.iptv-frontend`
- **Stop**: `launchctl stop com.jesse.iptv-server` / `launchctl stop com.jesse.iptv-frontend`
- **Restart**: Stop then start, or reload: `launchctl unload ~/Library/LaunchAgents/com.jesse.iptv-server.plist && launchctl load ~/Library/LaunchAgents/com.jesse.iptv-server.plist`
- **Check Status**: `launchctl list | grep iptv`

### Logs

- Backend: `logs/server.log` and `logs/server.error.log`
- Frontend: `logs/frontend.log` and `logs/frontend.error.log`

## Quick Start

1. **Set Password** (optional):
   ```bash
   export IPTV_PASSWORD="your-password"
   # Or create backend/.env file
   ```

2. **Start Backend**:
   ```bash
   cd backend
   source venv/bin/activate
   python app.py
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   python3 -m http.server 8000 --bind 0.0.0.0
   ```

4. **Access**: Open `http://localhost:8000` in your browser

## Documentation

- [Server Setup Guide](SERVER_SETUP.md) - Detailed server configuration
- [Password Setup](SETUP_PASSWORD.md) - Password protection setup
- [iPhone Access](IPHONE_ACCESS.md) - Mobile device access
- [Troubleshooting](IPHONE_TROUBLESHOOTING.md) - Common issues and solutions

## Project Structure

```
iptv/
├── backend/          # Flask API server
│   ├── app.py       # Main application
│   ├── config.py    # Configuration
│   ├── database.py  # Database operations
│   └── ...
├── frontend/         # Web application
│   ├── index.html   # Main HTML
│   ├── app.js       # Application logic
│   └── ...
├── database/         # SQLite databases
├── logs/             # Server logs
└── *.plist          # LaunchAgent configs
```

## License

MIT License - See LICENSE file for details


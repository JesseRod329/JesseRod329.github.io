"""Flask application with API endpoints."""
import os
import sys
from pathlib import Path

# Add backend directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from flask import Flask, jsonify, request, session
from flask_cors import CORS
from functools import wraps
from config import get_config
from database import Database
from playlist_parser import PlaylistParser
from epg_fetcher import EPGFetcher
import hashlib

app = Flask(__name__)
config = get_config()
app.config.from_object(config)
# Session secret key for password authentication
app.secret_key = config.SECRET_KEY

# Enable CORS
# For local network access, use a more permissive approach
# Check if origin matches local network patterns
def is_local_network_origin(origin):
    """Check if origin is from local network."""
    if not origin:
        return False
    # Allow localhost
    if origin.startswith('http://localhost') or origin.startswith('http://127.0.0.1'):
        return True
    # Allow local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    import re
    local_patterns = [
        r'http://192\.168\.\d+\.\d+',
        r'http://10\.\d+\.\d+\.\d+',
        r'http://172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+',
    ]
    for pattern in local_patterns:
        if re.match(pattern, origin):
            return True
    return False

# Use resources parameter for more flexible CORS
CORS(app, 
     origins=config.CORS_ORIGINS,
     resources={
         r"/api/*": {
             "origins": "*",  # Allow all origins for local network (you can restrict this)
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"]
         }
     })

# Initialize database
db = Database()

# Password authentication decorator
def require_auth(f):
    """Decorator to require password authentication."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Skip auth if password is not set
        if not config.PASSWORD_REQUIRED:
            return f(*args, **kwargs)
        
        # Check if user is authenticated
        if not session.get('authenticated', False):
            return jsonify({'error': 'Authentication required', 'authenticated': False}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login endpoint to authenticate with password."""
    data = request.get_json() or {}
    password = data.get('password', '')
    
    # Skip auth if password is not set
    if not config.PASSWORD_REQUIRED:
        return jsonify({'success': True, 'authenticated': True, 'message': 'Password protection is disabled'})
    
    # Hash the provided password and compare with stored hash
    # Simple hash comparison (in production, use proper password hashing like bcrypt)
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    stored_hash = hashlib.sha256(config.APP_PASSWORD.encode()).hexdigest()
    
    if password_hash == stored_hash:
        session['authenticated'] = True
        return jsonify({'success': True, 'authenticated': True})
    else:
        return jsonify({'success': False, 'error': 'Invalid password'}), 401

@app.route('/api/auth/check', methods=['GET'])
def check_auth():
    """Check authentication status."""
    if not config.PASSWORD_REQUIRED:
        return jsonify({'authenticated': True, 'password_required': False})
    return jsonify({
        'authenticated': session.get('authenticated', False),
        'password_required': True
    })

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout endpoint."""
    session.pop('authenticated', None)
    return jsonify({'success': True, 'authenticated': False})

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({'status': 'ok'})

@app.route('/api/playlists/fetch', methods=['POST'])
@require_auth
def fetch_playlist():
    """Fetch and import playlist from URL."""
    data = request.get_json()
    url = data.get('url', config.IPTV_ORG_INDEX_URL)
    
    try:
        channels = PlaylistParser.parse_playlist_url(url)
        
        # Import channels to database
        imported = 0
        for channel in channels:
            if PlaylistParser.validate_url(channel.get('url', '')):
                db.add_channel(channel)
                imported += 1
        
        return jsonify({
            'success': True,
            'imported': imported,
            'total': len(channels)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/channels', methods=['GET'])
@require_auth
def get_channels():
    """Get channels with optional filters."""
    filters = {}
    
    if request.args.get('category'):
        filters['category'] = request.args.get('category')
    if request.args.get('country'):
        filters['country'] = request.args.get('country')
    if request.args.get('language'):
        filters['language'] = request.args.get('language')
    if request.args.get('network'):
        filters['network'] = request.args.get('network')
    if request.args.get('search'):
        filters['search'] = request.args.get('search')
    
    # Support limit parameter for checking if channels exist
    limit = request.args.get('limit')
    
    channels = db.get_channels(filters)
    
    # Apply limit if specified
    if limit:
        try:
            limit_int = int(limit)
            channels = channels[:limit_int]
        except ValueError:
            pass
    
    # Add favorite status
    for channel in channels:
        channel['is_favorite'] = db.is_favorite(channel['id'])
    
    return jsonify({'channels': channels})

@app.route('/api/channels/local', methods=['GET'])
@require_auth
def get_local_channels():
    """Get local channels based on zip code."""
    zip_code = request.args.get('zip')
    
    if not zip_code:
        return jsonify({'error': 'Zip code is required'}), 400
    
    # Try to filter by US country first
    filters = {}
    if len(zip_code) == 5 and zip_code.isdigit():
        filters['country'] = 'United States'
        
    channels = db.get_channels(filters)
    
    # If strict country filter returned no results, try broader search
    if not channels:
        # Try 'US' or 'USA'
        filters['country'] = 'US'
        channels = db.get_channels(filters)
        
        if not channels:
            # Fallback: Get ALL channels and filter manually
            channels = db.get_channels({})
    
    # Filter for "local" channels based on common network names
    local_keywords = ['ABC', 'NBC', 'CBS', 'FOX', 'PBS', 'CW', 'Local', 'News', 'Weather', 'KTV', 'WTV', 'KABC', 'WABC', 'KNBC', 'WNBC', 'KCBS', 'WCBS', 'KFOX', 'WFOX']
    local_channels = []
    
    # Helper to check keywords
    def is_local_channel(channel):
        name = channel.get('name', '').upper()
        network = channel.get('network', '').upper() if channel.get('network') else ''
        country = channel.get('country', '').upper() if channel.get('country') else ''
        
        # If we have country info, prioritize US channels
        if country and country not in ['US', 'USA', 'UNITED STATES']:
            return False
            
        for keyword in local_keywords:
            if keyword in name or keyword in network:
                return True
        return False

    for channel in channels:
        if is_local_channel(channel):
            local_channels.append(channel)
            
    # If we found local channels, return top 50
    if local_channels:
        # Sort by name
        local_channels.sort(key=lambda x: x.get('name', ''))
        
        # Add favorite status
        result = local_channels[:50]
        for channel in result:
            channel['is_favorite'] = db.is_favorite(channel['id'])
        return jsonify({'channels': result})
    
    # Absolute Fallback: If we still have nothing, return popular news/US channels
    fallback_keywords = ['CNN', 'MSNBC', 'BBC', 'News']
    fallback_channels = []
    
    all_channels = db.get_channels({})
    for channel in all_channels:
        name = channel.get('name', '').upper()
        for kw in fallback_keywords:
            if kw in name:
                fallback_channels.append(channel)
                
    # Add favorite status
    for channel in fallback_channels:
        channel['is_favorite'] = db.is_favorite(channel['id'])
        
    return jsonify({'channels': fallback_channels[:20]})

@app.route('/api/channels/<int:channel_id>', methods=['GET'])
@require_auth
def get_channel(channel_id):
    """Get a specific channel."""
    channel = db.get_channel_by_id(channel_id)
    if channel:
        channel['is_favorite'] = db.is_favorite(channel_id)
        return jsonify({'channel': channel})
    return jsonify({'error': 'Channel not found'}), 404

@app.route('/api/channels/<int:channel_id>/play', methods=['POST'])
@require_auth
def play_channel(channel_id):
    """Record playback and return channel info."""
    channel = db.get_channel_by_id(channel_id)
    if channel:
        db.add_playback_history(channel_id)
        return jsonify({'channel': channel})
    return jsonify({'error': 'Channel not found'}), 404

@app.route('/api/favorites', methods=['GET'])
@require_auth
def get_favorites():
    """Get all favorite channels."""
    favorites = db.get_favorites()
    return jsonify({'channels': favorites})

@app.route('/api/favorites', methods=['POST'])
@require_auth
def add_favorite():
    """Add a channel to favorites."""
    data = request.get_json()
    channel_id = data.get('channel_id')
    
    if not channel_id:
        return jsonify({'error': 'channel_id is required'}), 400
    
    success = db.add_favorite(channel_id)
    return jsonify({'success': success})

@app.route('/api/favorites/<int:channel_id>', methods=['DELETE'])
@require_auth
def remove_favorite(channel_id):
    """Remove a channel from favorites."""
    success = db.remove_favorite(channel_id)
    return jsonify({'success': success})

@app.route('/api/categories', methods=['GET'])
@require_auth
def get_categories():
    """Get all categories."""
    categories = db.get_categories()
    return jsonify({'categories': categories})

@app.route('/api/countries', methods=['GET'])
@require_auth
def get_countries():
    """Get all countries."""
    countries = db.get_countries()
    return jsonify({'countries': countries})

@app.route('/api/networks', methods=['GET'])
@require_auth
def get_networks():
    """Get all networks."""
    networks = db.get_networks()
    return jsonify({'networks': networks})

@app.route('/api/epg/sources', methods=['GET'])
@require_auth
def get_epg_sources():
    """Get available EPG sources.
    
    Returns information about available EPG sources, including
    the iptv-org/epg pre-generated guides.
    See: https://github.com/iptv-org/epg
    """
    sources = []
    for i, url in enumerate(config.EPG_SOURCES):
        sources.append({
            'id': i,
            'url': url,
            'name': 'iptv-org/epg Guide' if 'iptv-org.github.io/epg' in url else f'EPG Source {i+1}',
            'description': 'Pre-generated EPG guide from iptv-org/epg covering thousands of channels from hundreds of sources'
        })
    
    return jsonify({
        'sources': sources,
        'default': config.EPG_SOURCES[0] if config.EPG_SOURCES else None,
        'info': {
            'repository': 'https://github.com/iptv-org/epg',
            'description': 'Utilities for downloading EPG data from hundreds of sources'
        }
    })

@app.route('/api/epg/<int:channel_id>', methods=['GET'])
@require_auth
def get_epg_for_channel(channel_id):
    """Get EPG data for a channel."""
    channel = db.get_channel_by_id(channel_id)
    if not channel:
        return jsonify({'error': 'Channel not found'}), 404
    
    tvg_id = channel.get('tvg_id')
    epg_data = db.get_epg_for_channel(channel_id=channel_id, tvg_id=tvg_id)
    
    # Sort by start_time
    epg_data.sort(key=lambda x: x.get('start_time', ''))
    
    return jsonify({
        'epg': epg_data,
        'channel': {
            'id': channel['id'],
            'name': channel.get('name'),
            'tvg_id': tvg_id
        }
    })

@app.route('/api/epg/fetch', methods=['POST'])
@require_auth
def fetch_epg():
    """Fetch EPG data from source.
    
    Uses iris.digital EPG by default (https://epg.iris.digital/epg/us.xml.gz)
    Supports both regular XML and gzipped XML (.xml.gz) files.
    """
    data = request.get_json() or {}
    source_url = data.get('url')
    
    # If no URL provided, use the default source from config
    if not source_url:
        source_url = config.EPG_SOURCES[0] if config.EPG_SOURCES else None
    
    if not source_url:
        return jsonify({
            'success': False,
            'error': 'EPG source URL is required',
            'hint': 'Please provide an XMLTV EPG source URL. The default source is https://epg.iris.digital/epg/us.xml.gz'
        }), 400
    
    try:
        # Fetch EPG data from the source
        epg_entries = EPGFetcher.fetch_from_source(source_url)
        
        if not epg_entries:
            return jsonify({
                'success': False,
                'error': 'No EPG data found in source',
                'details': 'The source may be empty, the format is unsupported, or the URL is incorrect.',
                'hint': f'Make sure {source_url} is accessible and contains valid XMLTV format data. You can test the URL in a browser to verify it returns XML content.'
            }), 400
        
        # Map EPG entries to channels by tvg_id
        channels = db.get_channels()
        tvg_id_map = {ch.get('tvg_id'): ch['id'] for ch in channels if ch.get('tvg_id')}
        
        # Add channel_id to EPG entries
        matched_count = 0
        for entry in epg_entries:
            tvg_id = entry.get('tvg_id')
            if tvg_id in tvg_id_map:
                entry['channel_id'] = tvg_id_map[tvg_id]
                matched_count += 1
        
        # Save to database
        db.save_epg_data(epg_entries)
        
        return jsonify({
            'success': True,
            'imported': len(epg_entries),
            'matched_channels': matched_count,
            'source': source_url,
            'message': f'Successfully imported {len(epg_entries)} EPG entries. Matched {matched_count} with your channels.'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'hint': 'Make sure the EPG source URL is accessible and in XMLTV format. You can generate EPG guides using the iptv-org/epg tool: https://github.com/iptv-org/epg'
        }), 500

@app.route('/api/playlists/custom', methods=['GET'])
@require_auth
def get_custom_playlists():
    """Get all custom playlists."""
    playlists = db.get_custom_playlists()
    return jsonify({'playlists': playlists})

@app.route('/api/channels/recently-watched', methods=['GET'])
@require_auth
def get_recently_watched():
    """Get recently watched channels."""
    limit = request.args.get('limit', 20, type=int)
    channels = db.get_recently_watched(limit)
    
    # Add favorite status
    for channel in channels:
        channel['is_favorite'] = db.is_favorite(channel['id'])
    
    return jsonify({'channels': channels})

@app.route('/api/history', methods=['GET'])
@require_auth
def get_history():
    """Get playback history."""
    limit = request.args.get('limit', 50, type=int)
    history = db.get_playback_history(limit)
    return jsonify({'history': history})

@app.route('/api/playlists/custom', methods=['POST'])
@require_auth
def save_custom_playlist():
    """Save a custom playlist."""
    data = request.get_json()
    name = data.get('name')
    channels = data.get('channels', [])
    
    if not name:
        return jsonify({'error': 'name is required'}), 400
    
    playlist_id = db.save_custom_playlist(name, channels)
    return jsonify({'success': True, 'playlist_id': playlist_id})

@app.route('/api/vlc/open', methods=['POST'])
@require_auth
def open_in_vlc():
    """Open a stream URL in VLC (Mac only)."""
    import subprocess
    import platform
    
    if platform.system() != 'Darwin':  # Darwin is macOS
        return jsonify({'error': 'This feature is only available on macOS'}), 400
    
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    try:
        # Method 1: Try opening VLC app directly with URL as argument (most reliable)
        vlc_binary = '/Applications/VLC.app/Contents/MacOS/VLC'
        if os.path.exists(vlc_binary):
            subprocess.Popen([vlc_binary, url],
                           stdout=subprocess.DEVNULL,
                           stderr=subprocess.DEVNULL)
            return jsonify({'success': True, 'method': 'direct_app'})
        
        # Method 2: Try using 'open' command with VLC app bundle
        if os.path.exists('/Applications/VLC.app'):
            subprocess.Popen(['open', '-a', 'VLC', url],
                           stdout=subprocess.DEVNULL,
                           stderr=subprocess.DEVNULL)
            return jsonify({'success': True, 'method': 'open_command'})
        
        # Method 3: Try vlc:// protocol (may not be registered)
        try:
            subprocess.Popen(['open', f'vlc://{url}'], 
                            stdout=subprocess.DEVNULL, 
                            stderr=subprocess.DEVNULL)
            return jsonify({'success': True, 'method': 'vlc_protocol'})
        except:
            pass
        
        # If all methods fail, return instructions
        return jsonify({
            'success': False,
            'error': 'VLC not found',
            'message': 'Please install VLC Media Player from https://www.videolan.org/vlc/',
            'url': url
        }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'url': url
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=config.DEBUG)


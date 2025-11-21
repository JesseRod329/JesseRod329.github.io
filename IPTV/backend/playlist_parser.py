"""M3U playlist parsing and validation."""
import re
import requests
from typing import List, Dict, Optional
from urllib.parse import urlparse

class PlaylistParser:
    """Parse M3U playlists."""
    
    @staticmethod
    def parse_m3u(content: str) -> List[Dict]:
        """Parse M3U content and return list of channels."""
        channels = []
        lines = content.strip().split('\n')
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            # Check for #EXTM3U header
            if line == '#EXTM3U':
                i += 1
                continue
            
            # Check for #EXTINF line
            if line.startswith('#EXTINF:'):
                channel_info = PlaylistParser._parse_extinf(line)
                i += 1
                
                # Next line should be the URL
                if i < len(lines):
                    url = lines[i].strip()
                    if url and not url.startswith('#'):
                        channel_info['url'] = url
                        channels.append(channel_info)
                i += 1
            else:
                i += 1
        
        return channels
    
    @staticmethod
    def _parse_extinf(extinf_line: str) -> Dict:
        """Parse #EXTINF line and extract metadata."""
        # Format: #EXTINF:-1 tvg-id="..." tvg-name="..." tvg-logo="..." group-title="..." [name]
        channel = {
            'name': '',
            'url': '',
            'logo': None,
            'category': None,
            'country': None,
            'language': None,
            'tvg_id': None,
            'tvg_name': None,
            'group_title': None
        }
        
        # Extract attributes
        attrs_match = re.search(r'tvg-id="([^"]*)"', extinf_line)
        if attrs_match:
            channel['tvg_id'] = attrs_match.group(1)
        
        attrs_match = re.search(r'tvg-name="([^"]*)"', extinf_line)
        if attrs_match:
            channel['tvg_name'] = attrs_match.group(1)
        
        attrs_match = re.search(r'tvg-logo="([^"]*)"', extinf_line)
        if attrs_match:
            channel['logo'] = attrs_match.group(1)
        
        attrs_match = re.search(r'group-title="([^"]*)"', extinf_line)
        if attrs_match:
            channel['group_title'] = attrs_match.group(1)
            # Try to extract category from group-title
            group = attrs_match.group(1)
            if '|' in group:
                parts = group.split('|')
                if len(parts) >= 2:
                    channel['category'] = parts[0].strip()
                    channel['country'] = parts[1].strip()
            else:
                channel['category'] = group
        
        # Extract country and language from tvg-id if available
        if channel['tvg_id']:
            parts = channel['tvg_id'].split('.')
            if len(parts) >= 2:
                channel['country'] = parts[0].upper()
        
        # Extract channel name (usually at the end of the line)
        name_match = re.search(r',(.+)$', extinf_line)
        if name_match:
            channel['name'] = name_match.group(1).strip()
        elif channel['tvg_name']:
            channel['name'] = channel['tvg_name']
        
        return channel
    
    @staticmethod
    def fetch_playlist(url: str) -> Optional[str]:
        """Fetch playlist content from URL."""
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"Error fetching playlist: {e}")
            return None
    
    @staticmethod
    def validate_url(url: str) -> bool:
        """Validate if URL is a valid stream URL."""
        try:
            parsed = urlparse(url)
            return parsed.scheme in ['http', 'https', 'rtmp', 'rtsp', 'udp']
        except:
            return False
    
    @staticmethod
    def parse_playlist_url(url: str) -> List[Dict]:
        """Fetch and parse a playlist from URL."""
        content = PlaylistParser.fetch_playlist(url)
        if content:
            return PlaylistParser.parse_m3u(content)
        return []











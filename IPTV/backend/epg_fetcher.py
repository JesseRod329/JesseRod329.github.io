"""EPG data fetching from various sources."""
import requests
import xml.etree.ElementTree as ET
import gzip
import io
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from config import Config

class EPGFetcher:
    """Fetch EPG data from XMLTV sources."""
    
    @staticmethod
    def fetch_xmltv(url: str) -> Optional[str]:
        """Fetch XMLTV content from URL. Supports both regular XML and gzipped XML (.xml.gz) files."""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Accept-Encoding': 'gzip, deflate'
            }
            response = requests.get(url, timeout=120, headers=headers, stream=True)
            response.raise_for_status()
            
            # Check if the URL indicates it's a gzipped file
            is_gzipped = url.endswith('.gz') or url.endswith('.xml.gz')
            content_type = response.headers.get('content-type', '').lower()
            content_encoding = response.headers.get('content-encoding', '').lower()
            
            # Also check content-encoding header
            if not is_gzipped:
                is_gzipped = 'gzip' in content_encoding
            
            if is_gzipped:
                # Decompress gzipped content
                print(f"Detected gzipped content, decompressing...")
                compressed_data = response.content
                try:
                    decompressed_data = gzip.decompress(compressed_data)
                    xml_content = decompressed_data.decode('utf-8')
                    print(f"Successfully decompressed {len(compressed_data)} bytes to {len(xml_content)} characters")
                    return xml_content
                except gzip.BadGzipFile:
                    print(f"Warning: File has .gz extension but is not gzipped, trying as regular XML")
                    # Fall through to regular text handling
                    xml_content = response.text
                except Exception as e:
                    print(f"Error decompressing gzipped content: {e}")
                    return None
            else:
                # Regular XML content
                xml_content = response.text
            
            # Verify it's XML
            if xml_content.strip().startswith('<?xml') or xml_content.strip().startswith('<tv'):
                return xml_content
            else:
                print(f"Warning: Response doesn't appear to be XML. Content-Type: {content_type}")
                print(f"First 200 chars: {xml_content[:200]}")
                # Still try to parse it as XML in case headers are wrong
                return xml_content
                
        except requests.exceptions.HTTPError as e:
            print(f"HTTP error fetching EPG from {url}: {e}")
            if e.response.status_code == 404:
                print(f"URL not found. The EPG source may have moved or the URL is incorrect.")
            return None
        except Exception as e:
            print(f"Error fetching EPG from {url}: {e}")
            return None
    
    @staticmethod
    def parse_xmltv(xml_content: str) -> List[Dict]:
        """Parse XMLTV content and return EPG entries."""
        epg_entries = []
        
        if not xml_content or not xml_content.strip():
            print("Warning: Empty XML content received")
            return epg_entries
        
        try:
            # Try to parse the XML
            root = ET.fromstring(xml_content)
            
            # XMLTV format: <tv><channel>...</channel><programme>...</programme></tv>
            programmes = root.findall('.//programme')
            print(f"Found {len(programmes)} programme entries in XML")
            
            for programme in programmes:
                entry = {
                    'tvg_id': programme.get('channel'),
                    'title': '',
                    'start_time': '',
                    'end_time': '',
                    'description': '',
                    'category': ''
                }
                
                # Parse start and end times
                start_str = programme.get('start')
                stop_str = programme.get('stop')
                
                if start_str:
                    entry['start_time'] = EPGFetcher._parse_xmltv_time(start_str)
                if stop_str:
                    entry['end_time'] = EPGFetcher._parse_xmltv_time(stop_str)
                
                # Parse title
                title_elem = programme.find('title')
                if title_elem is not None and title_elem.text:
                    entry['title'] = title_elem.text.strip()
                
                # Parse description
                desc_elem = programme.find('desc')
                if desc_elem is not None and desc_elem.text:
                    entry['description'] = desc_elem.text.strip()
                
                # Parse category
                category_elem = programme.find('category')
                if category_elem is not None and category_elem.text:
                    entry['category'] = category_elem.text.strip()
                
                # Only add entries with both tvg_id and title
                if entry['tvg_id'] and entry['title']:
                    epg_entries.append(entry)
            
            print(f"Successfully parsed {len(epg_entries)} valid EPG entries")
        
        except ET.ParseError as e:
            print(f"Error parsing XMLTV: {e}")
            print(f"First 500 chars of content: {xml_content[:500]}")
        except Exception as e:
            print(f"Unexpected error parsing XMLTV: {e}")
        
        return epg_entries
    
    @staticmethod
    def _parse_xmltv_time(time_str: str) -> str:
        """Parse XMLTV time format to SQLite datetime format."""
        # XMLTV format: YYYYMMDDHHMMSS +0000
        # Convert to: YYYY-MM-DD HH:MM:SS
        try:
            if len(time_str) >= 14:
                year = time_str[0:4]
                month = time_str[4:6]
                day = time_str[6:8]
                hour = time_str[8:10]
                minute = time_str[10:12]
                second = time_str[12:14]
                return f"{year}-{month}-{day} {hour}:{minute}:{second}"
        except:
            pass
        return time_str
    
    @staticmethod
    def fetch_from_source(source_url: str) -> List[Dict]:
        """Fetch and parse EPG from a source URL."""
        xml_content = EPGFetcher.fetch_xmltv(source_url)
        if xml_content:
            return EPGFetcher.parse_xmltv(xml_content)
        return []
    
    @staticmethod
    def get_current_programmes(epg_entries: List[Dict], tvg_id: str = None) -> List[Dict]:
        """Get currently airing programmes."""
        now = datetime.now()
        current = []
        
        for entry in epg_entries:
            if tvg_id and entry.get('tvg_id') != tvg_id:
                continue
            
            try:
                start = datetime.strptime(entry['start_time'], '%Y-%m-%d %H:%M:%S')
                end = datetime.strptime(entry['end_time'], '%Y-%m-%d %H:%M:%S')
                
                if start <= now <= end:
                    entry['is_current'] = True
                    current.append(entry)
            except:
                continue
        
        return current
    
    @staticmethod
    def get_upcoming_programmes(epg_entries: List[Dict], tvg_id: str = None, hours: int = 24) -> List[Dict]:
        """Get upcoming programmes within specified hours."""
        now = datetime.now()
        end_time = now + timedelta(hours=hours)
        upcoming = []
        
        for entry in epg_entries:
            if tvg_id and entry.get('tvg_id') != tvg_id:
                continue
            
            try:
                start = datetime.strptime(entry['start_time'], '%Y-%m-%d %H:%M:%S')
                
                if now <= start <= end_time:
                    entry['is_current'] = False
                    upcoming.append(entry)
            except:
                continue
        
        return upcoming










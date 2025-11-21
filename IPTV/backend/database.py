"""Database models and operations."""
import sqlite3
import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
from config import DATABASE_PATH
from network_extractor import extract_network

class Database:
    """Database connection and operations."""
    
    def __init__(self, db_path: str = None):
        self.db_path = db_path or DATABASE_PATH
        self.init_database()
    
    def get_connection(self):
        """Get database connection."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_database(self):
        """Initialize database tables."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Channels table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS channels (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                url TEXT NOT NULL,
                logo TEXT,
                category TEXT,
                country TEXT,
                language TEXT,
                network TEXT,
                tvg_id TEXT,
                tvg_name TEXT,
                group_title TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(url)
            )
        ''')
        
        # Add network column if it doesn't exist (for existing databases)
        try:
            cursor.execute('ALTER TABLE channels ADD COLUMN network TEXT')
        except sqlite3.OperationalError:
            pass  # Column already exists
        
        # Favorites table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS favorites (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                channel_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE,
                UNIQUE(channel_id)
            )
        ''')
        
        # Custom playlists table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS custom_playlists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                channels_json TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # EPG data table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS epg_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                channel_id INTEGER,
                tvg_id TEXT,
                title TEXT NOT NULL,
                start_time TIMESTAMP NOT NULL,
                end_time TIMESTAMP NOT NULL,
                description TEXT,
                category TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
            )
        ''')
        
        # Playback history table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS playback_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                channel_id INTEGER NOT NULL,
                played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
            )
        ''')
        
        # Recently watched view (virtual table for quick access)
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_playback_history_played_at ON playback_history(played_at DESC)
        ''')
        
        # Create indexes
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_channels_category ON channels(category)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_channels_country ON channels(country)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_favorites_channel ON favorites(channel_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_epg_tvg_id ON epg_data(tvg_id)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_epg_start_time ON epg_data(start_time)')
        
        conn.commit()
        conn.close()
    
    def add_channel(self, channel_data: Dict) -> int:
        """Add a channel to the database."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Extract network from channel name
        network = channel_data.get('network')
        if not network:
            network = extract_network(
                channel_data.get('name', ''),
                channel_data.get('tvg_name')
            )
        
        cursor.execute('''
            INSERT OR REPLACE INTO channels 
            (name, url, logo, category, country, language, network, tvg_id, tvg_name, group_title, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            channel_data.get('name'),
            channel_data.get('url'),
            channel_data.get('logo'),
            channel_data.get('category'),
            channel_data.get('country'),
            channel_data.get('language'),
            network,
            channel_data.get('tvg_id'),
            channel_data.get('tvg_name'),
            channel_data.get('group_title'),
            datetime.now()
        ))
        
        channel_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return channel_id
    
    def get_channels(self, filters: Optional[Dict] = None) -> List[Dict]:
        """Get channels with optional filters."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        query = 'SELECT * FROM channels WHERE 1=1'
        params = []
        
        if filters:
            if filters.get('category'):
                query += ' AND category = ?'
                params.append(filters['category'])
            if filters.get('country'):
                query += ' AND country = ?'
                params.append(filters['country'])
            if filters.get('language'):
                query += ' AND language = ?'
                params.append(filters['language'])
            if filters.get('network'):
                query += ' AND network = ?'
                params.append(filters['network'])
            if filters.get('search'):
                search_term = f"%{filters['search']}%"
                # Default: search in name and tvg_name
                search_conditions = ['(name LIKE ? OR tvg_name LIKE ?)']
                search_params = [search_term, search_term]
                
                # If search options are provided, expand search fields
                # Note: searchOptions would come from frontend but we'll check all fields by default
                # This allows searching across name, category, and country
                search_conditions.append('category LIKE ?')
                search_conditions.append('country LIKE ?')
                search_params.extend([search_term, search_term])
                
                query += ' AND (' + ' OR '.join(search_conditions) + ')'
                params.extend(search_params)
        
        # Sorting
        sort_by = filters.get('sort', 'name') if filters else 'name'
        if sort_by == 'country':
            query += ' ORDER BY country ASC, name ASC'
        elif sort_by == 'category':
            query += ' ORDER BY category ASC, name ASC'
        elif sort_by == 'recent':
            # Sort by most recently watched
            query = '''
                SELECT c.*, MAX(h.played_at) as last_played
                FROM channels c
                LEFT JOIN playback_history h ON c.id = h.channel_id
                WHERE 1=1
            '''
            # Re-add filters
            if filters:
                if filters.get('category'):
                    query += ' AND c.category = ?'
                if filters.get('country'):
                    query += ' AND c.country = ?'
            query += ' GROUP BY c.id ORDER BY last_played DESC NULLS LAST, c.name ASC'
        else:
            query += ' ORDER BY name ASC'
        
        # Limit and offset for pagination
        if filters:
            limit = filters.get('limit')
            offset = filters.get('offset', 0)
            if limit:
                query += f' LIMIT {limit}'
                if offset:
                    query += f' OFFSET {offset}'
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def get_channel_by_id(self, channel_id: int) -> Optional[Dict]:
        """Get a channel by ID."""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM channels WHERE id = ?', (channel_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None
    
    def add_favorite(self, channel_id: int) -> bool:
        """Add a channel to favorites."""
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            # Check if already exists
            cursor.execute('SELECT 1 FROM favorites WHERE channel_id = ?', (channel_id,))
            exists = cursor.fetchone() is not None
            
            if not exists:
                cursor.execute('INSERT INTO favorites (channel_id) VALUES (?)', (channel_id,))
                conn.commit()
                return True
            else:
                # Already favorited, return True (success)
                return True
        except Exception as e:
            print(f"Error adding favorite: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()
    
    def remove_favorite(self, channel_id: int) -> bool:
        """Remove a channel from favorites."""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM favorites WHERE channel_id = ?', (channel_id,))
        success = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return success
    
    def get_favorites(self) -> List[Dict]:
        """Get all favorite channels."""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT c.* FROM channels c
            INNER JOIN favorites f ON c.id = f.channel_id
            ORDER BY f.created_at DESC
        ''')
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]
    
    def is_favorite(self, channel_id: int) -> bool:
        """Check if a channel is in favorites."""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT 1 FROM favorites WHERE channel_id = ?', (channel_id,))
        result = cursor.fetchone() is not None
        conn.close()
        return result
    
    def add_playback_history(self, channel_id: int):
        """Add playback history entry."""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO playback_history (channel_id) VALUES (?)', (channel_id,))
        conn.commit()
        conn.close()
    
    def get_categories(self) -> List[str]:
        """Get all unique categories."""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT DISTINCT category FROM channels WHERE category IS NOT NULL ORDER BY category')
        rows = cursor.fetchall()
        conn.close()
        return [row[0] for row in rows]
    
    def get_countries(self) -> List[str]:
        """Get all unique countries."""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT DISTINCT country FROM channels WHERE country IS NOT NULL ORDER BY country')
        rows = cursor.fetchall()
        conn.close()
        return [row[0] for row in rows]
    
    def get_networks(self) -> List[str]:
        """Get all unique networks."""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT DISTINCT network FROM channels WHERE network IS NOT NULL ORDER BY network')
        rows = cursor.fetchall()
        conn.close()
        return [row[0] for row in rows]
    
    def save_custom_playlist(self, name: str, channels: List[Dict]) -> int:
        """Save a custom playlist."""
        conn = self.get_connection()
        cursor = conn.cursor()
        channels_json = json.dumps(channels)
        cursor.execute('''
            INSERT INTO custom_playlists (name, channels_json, updated_at)
            VALUES (?, ?, ?)
        ''', (name, channels_json, datetime.now()))
        playlist_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return playlist_id
    
    def get_custom_playlists(self) -> List[Dict]:
        """Get all custom playlists."""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM custom_playlists ORDER BY created_at DESC')
        rows = cursor.fetchall()
        playlists = []
        for row in rows:
            playlist = dict(row)
            playlist['channels'] = json.loads(playlist['channels_json'])
            playlists.append(playlist)
        conn.close()
        return playlists
    
    def save_epg_data(self, epg_entries: List[Dict]):
        """Save EPG data."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Clear old EPG data (older than 7 days)
        cursor.execute('DELETE FROM epg_data WHERE start_time < datetime("now", "-7 days")')
        
        for entry in epg_entries:
            cursor.execute('''
                INSERT OR REPLACE INTO epg_data 
                (channel_id, tvg_id, title, start_time, end_time, description, category)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                entry.get('channel_id'),
                entry.get('tvg_id'),
                entry.get('title'),
                entry.get('start_time'),
                entry.get('end_time'),
                entry.get('description'),
                entry.get('category')
            ))
        
        conn.commit()
        conn.close()
    
    def get_epg_for_channel(self, channel_id: int = None, tvg_id: str = None) -> List[Dict]:
        """Get EPG data for a channel."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        if channel_id:
            cursor.execute('''
                SELECT * FROM epg_data 
                WHERE channel_id = ? AND start_time >= datetime("now", "-1 hour")
                ORDER BY start_time ASC
            ''', (channel_id,))
        elif tvg_id:
            cursor.execute('''
                SELECT * FROM epg_data 
                WHERE tvg_id = ? AND start_time >= datetime("now", "-1 hour")
                ORDER BY start_time ASC
            ''', (tvg_id,))
        else:
            return []
        
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]
    
    def get_recently_watched(self, limit: int = 20) -> List[Dict]:
        """Get recently watched channels."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT DISTINCT c.*, MAX(h.played_at) as last_played
            FROM channels c
            INNER JOIN playback_history h ON c.id = h.channel_id
            GROUP BY c.id
            ORDER BY last_played DESC
            LIMIT ?
        ''', (limit,))
        
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]
    
    def get_playback_history(self, limit: int = 50) -> List[Dict]:
        """Get playback history with channel details."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT h.*, c.name as channel_name, c.logo, c.category, c.country
            FROM playback_history h
            INNER JOIN channels c ON h.channel_id = c.id
            ORDER BY h.played_at DESC
            LIMIT ?
        ''', (limit,))
        
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]









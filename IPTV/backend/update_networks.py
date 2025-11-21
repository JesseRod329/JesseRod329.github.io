#!/usr/bin/env python3
"""Update existing channels with network information."""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from database import Database
from network_extractor import extract_network

def update_all_channels():
    """Update all channels with network information."""
    db = Database()
    conn = db.get_connection()
    cursor = conn.cursor()
    
    # Get all channels without networks
    cursor.execute('SELECT id, name, tvg_name FROM channels WHERE network IS NULL OR network = ""')
    channels = cursor.fetchall()
    
    updated = 0
    for channel in channels:
        channel_id, name, tvg_name = channel
        network = extract_network(name or '', tvg_name)
        
        if network:
            cursor.execute('UPDATE channels SET network = ? WHERE id = ?', (network, channel_id))
            updated += 1
            print(f"Updated channel {channel_id}: {name} -> Network: {network}")
    
    conn.commit()
    conn.close()
    
    print(f"\nUpdated {updated} channels with network information.")

if __name__ == '__main__':
    update_all_channels()




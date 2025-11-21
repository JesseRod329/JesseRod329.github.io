"""Extract network names from channel names."""
import re
from typing import Optional

# Common network patterns (case-insensitive)
NETWORK_PATTERNS = [
    # Major US Networks
    r'\b(ABC|American Broadcasting Company)\b',
    r'\b(CBS|Columbia Broadcasting System)\b',
    r'\b(NBC|National Broadcasting Company)\b',
    r'\b(FOX|Fox)\b',
    r'\b(CW|The CW)\b',
    r'\b(PBS|Public Broadcasting Service)\b',
    
    # News Networks
    r'\b(CNN|Cable News Network)\b',
    r'\b(MSNBC)\b',
    r'\b(FOX News|Fox News)\b',
    r'\b(CNBC)\b',
    r'\b(BBC|British Broadcasting Corporation)\b',
    r'\b(Al Jazeera)\b',
    r'\b(Reuters)\b',
    r'\b(AP|Associated Press)\b',
    
    # Sports Networks
    r'\b(ESPN)\b',
    r'\b(ESPN2|ESPN 2)\b',
    r'\b(ESPNU|ESPN U)\b',
    r'\b(FS1|Fox Sports 1)\b',
    r'\b(FS2|Fox Sports 2)\b',
    r'\b(NFL Network)\b',
    r'\b(NBA TV)\b',
    r'\b(NHL Network)\b',
    r'\b(MLB Network)\b',
    r'\b(Golf Channel)\b',
    r'\b(Tennis Channel)\b',
    r'\b(Olympic Channel)\b',
    
    # Entertainment Networks
    r'\b(HBO|Home Box Office)\b',
    r'\b(Showtime)\b',
    r'\b(Starz)\b',
    r'\b(Cinemax)\b',
    r'\b(AMC)\b',
    r'\b(FX)\b',
    r'\b(FXX)\b',
    r'\b(TNT)\b',
    r'\b(TBS)\b',
    r'\b(USA Network)\b',
    r'\b(Syfy)\b',
    r'\b(Comedy Central)\b',
    r'\b(MTV)\b',
    r'\b(VH1)\b',
    r'\b(BET)\b',
    r'\b(Discovery)\b',
    r'\b(History|History Channel)\b',
    r'\b(Nat Geo|National Geographic)\b',
    r'\b(Animal Planet)\b',
    r'\b(TLC)\b',
    r'\b(Food Network)\b',
    r'\b(HGTV)\b',
    r'\b(Travel Channel)\b',
    r'\b(A&E)\b',
    r'\b(Lifetime)\b',
    r'\b(Hallmark)\b',
    r'\b(Freeform)\b',
    r'\b(Disney|Disney Channel)\b',
    r'\b(Nickelodeon|Nick)\b',
    r'\b(Cartoon Network)\b',
    r'\b(Adult Swim)\b',
    
    # Premium/Streaming
    r'\b(Netflix)\b',
    r'\b(Hulu)\b',
    r'\b(Amazon Prime|Prime Video)\b',
    r'\b(Apple TV)\b',
    r'\b(Disney\+|Disney Plus)\b',
    r'\b(Paramount\+|Paramount Plus)\b',
    r'\b(Peacock)\b',
    r'\b(Max|HBO Max)\b',
    
    # International Networks
    r'\b(BBC)\b',
    r'\b(ITV)\b',
    r'\b(Channel 4)\b',
    r'\b(Sky)\b',
    r'\b(CBC|Canadian Broadcasting Corporation)\b',
    r'\b(CTV)\b',
    r'\b(Global)\b',
    r'\b(ABC Australia)\b',
    r'\b(SBS)\b',
    
    # Spanish Networks
    r'\b(Univision)\b',
    r'\b(Telemundo)\b',
    r'\b(Estrella TV)\b',
    
    # Other
    r'\b(C-SPAN)\b',
    r'\b(QVC)\b',
    r'\b(HSN)\b',
    r'\b(Weather Channel)\b',
]

# Network name normalization (map variations to standard names)
NETWORK_NORMALIZATION = {
    'fox': 'FOX',
    'abc': 'ABC',
    'cbs': 'CBS',
    'nbc': 'NBC',
    'cnn': 'CNN',
    'espn': 'ESPN',
    'hbo': 'HBO',
    'discovery': 'Discovery',
    'national geographic': 'National Geographic',
    'nat geo': 'National Geographic',
    'history channel': 'History',
    'history': 'History',
    'disney channel': 'Disney',
    'disney': 'Disney',
    'nickelodeon': 'Nickelodeon',
    'nick': 'Nickelodeon',
    'cartoon network': 'Cartoon Network',
    'food network': 'Food Network',
    'travel channel': 'Travel Channel',
    'animal planet': 'Animal Planet',
    'tlc': 'TLC',
    'hgtv': 'HGTV',
    'a&e': 'A&E',
    'lifetime': 'Lifetime',
    'hallmark': 'Hallmark',
    'freeform': 'Freeform',
    'mtv': 'MTV',
    'vh1': 'VH1',
    'bet': 'BET',
    'comedy central': 'Comedy Central',
    'tnt': 'TNT',
    'tbs': 'TBS',
    'usa network': 'USA Network',
    'syfy': 'Syfy',
    'fx': 'FX',
    'fxx': 'FXX',
    'amc': 'AMC',
    'showtime': 'Showtime',
    'starz': 'Starz',
    'cinemax': 'Cinemax',
    'fox news': 'FOX News',
    'msnbc': 'MSNBC',
    'cnbc': 'CNBC',
    'nfl network': 'NFL Network',
    'nba tv': 'NBA TV',
    'nhl network': 'NHL Network',
    'mlb network': 'MLB Network',
    'golf channel': 'Golf Channel',
    'tennis channel': 'Tennis Channel',
    'olympic channel': 'Olympic Channel',
    'pbs': 'PBS',
    'cw': 'CW',
    'c-span': 'C-SPAN',
    'weather channel': 'Weather Channel',
    'univision': 'Univision',
    'telemundo': 'Telemundo',
    'estrella tv': 'Estrella TV',
    'bbc': 'BBC',
    'itv': 'ITV',
    'channel 4': 'Channel 4',
    'sky': 'Sky',
    'cbc': 'CBC',
    'ctv': 'CTV',
    'global': 'Global',
}

def extract_network(channel_name: str, tvg_name: Optional[str] = None) -> Optional[str]:
    """
    Extract network name from channel name or tvg_name.
    
    Args:
        channel_name: The channel name
        tvg_name: Optional tvg_name field
        
    Returns:
        Normalized network name or None if no network found
    """
    if not channel_name:
        return None
    
    # Combine channel name and tvg_name for searching
    search_text = channel_name
    if tvg_name:
        search_text = f"{channel_name} {tvg_name}"
    
    # Try patterns (case-insensitive)
    for pattern in NETWORK_PATTERNS:
        match = re.search(pattern, search_text, re.IGNORECASE)
        if match:
            network = match.group(1) if match.group(1) else match.group(0)
            # Normalize to standard name
            network_lower = network.lower()
            if network_lower in NETWORK_NORMALIZATION:
                return NETWORK_NORMALIZATION[network_lower]
            # Return capitalized version
            return network.strip()
    
    # Fallback: try to extract common patterns
    # Look for patterns like "ABC 5", "FOX HD", "CNN International"
    common_pattern = re.search(r'^([A-Z]{2,10})\s', channel_name, re.IGNORECASE)
    if common_pattern:
        potential_network = common_pattern.group(1).upper()
        # Check if it's a known network abbreviation
        if potential_network in ['ABC', 'CBS', 'NBC', 'FOX', 'CNN', 'ESPN', 'HBO', 'TNT', 'TBS', 'USA', 'FX', 'AMC', 'MTV', 'VH1', 'BET', 'PBS', 'CW', 'CNBC', 'MSNBC']:
            return potential_network
    
    return None

def get_all_networks(channels: list) -> list:
    """
    Extract all unique networks from a list of channels.
    
    Args:
        channels: List of channel dictionaries
        
    Returns:
        Sorted list of unique network names
    """
    networks = set()
    for channel in channels:
        network = extract_network(
            channel.get('name', ''),
            channel.get('tvg_name')
        )
        if network:
            networks.add(network)
    
    return sorted(list(networks))




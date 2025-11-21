"""Configuration management for different environments."""
import os
from pathlib import Path

# Try to load .env file if it exists
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)
except ImportError:
    # python-dotenv not installed, skip .env loading
    pass

# Base directory
BASE_DIR = Path(__file__).parent.parent

# Environment detection
ENV = os.getenv('ENVIRONMENT', 'dev').lower()

# Database configuration
DATABASE_DIR = BASE_DIR / 'database'
DATABASE_DIR.mkdir(exist_ok=True)

DATABASES = {
    'dev': DATABASE_DIR / 'dev.db',
    'test': DATABASE_DIR / 'test.db',
    'prod': DATABASE_DIR / 'prod.db'
}

DATABASE_PATH = DATABASES.get(ENV, DATABASES['dev'])

# Flask configuration
class Config:
    """Base configuration."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DATABASE_PATH = str(DATABASE_PATH)
    # CORS origins: localhost for local dev, plus regex for local network access
    # Allows access from iPhone and other devices on the same WiFi network
    # Also explicitly allow hosted frontend domains for cloud deployment
    CORS_ORIGINS = [
        'http://localhost:8000',
        'http://127.0.0.1:8000',
        'file://',
        r'http://192\.168\.\d+\.\d+:8000',  # 192.168.x.x
        r'http://10\.\d+\.\d+\.\d+:8000',   # 10.x.x.x
        r'http://172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:8000',  # 172.16-31.x.x
        # Hosted portfolio / GitHub Pages
        'https://jesserodriguez.me',
        'https://jesserod329.github.io',
    ]
    
    # IPTV-org playlist URLs
    IPTV_ORG_BASE_URL = 'https://iptv-org.github.io/iptv'
    IPTV_ORG_INDEX_URL = f'{IPTV_ORG_BASE_URL}/index.m3u'
    
    # EPG configuration
    EPG_CACHE_HOURS = 24
    # EPG sources - supports both regular XML and gzipped XML (.xml.gz) files
    EPG_SOURCES = [
        'https://epg.iris.digital/epg/us.xml.gz',  # US EPG from iris.digital
        # Additional EPG sources can be added here
    ]
    
    # EPG API endpoint (if using iptv-org/epg as a service)
    EPG_API_BASE = 'https://github.com/iptv-org/epg'
    
    # Password protection
    # Set this via environment variable: export IPTV_PASSWORD="your-password"
    # Or create a .env file with: IPTV_PASSWORD=your-password
    # If not set, password protection is disabled
    APP_PASSWORD = os.getenv('IPTV_PASSWORD', '')
    # Enable password protection (set to False to disable)
    PASSWORD_REQUIRED = bool(APP_PASSWORD)

class DevConfig(Config):
    """Development configuration."""
    DEBUG = True
    TESTING = False

class TestConfig(Config):
    """Testing configuration."""
    DEBUG = True
    TESTING = True
    DATABASE_PATH = str(DATABASES['test'])

class ProdConfig(Config):
    """Production configuration."""
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.getenv('SECRET_KEY')
    DATABASE_PATH = str(DATABASES['prod'])

# Get config based on environment
config_map = {
    'dev': DevConfig,
    'test': TestConfig,
    'prod': ProdConfig
}

def get_config():
    """Get configuration for current environment."""
    return config_map.get(ENV, DevConfig)








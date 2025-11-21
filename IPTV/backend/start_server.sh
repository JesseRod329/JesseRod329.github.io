#!/bin/bash
# Startup script for IPTV server

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Activate virtual environment
source venv/bin/activate

# Set environment variables
export ENVIRONMENT=${ENVIRONMENT:-dev}
export PORT=${PORT:-5001}

# Run the Flask app
python app.py




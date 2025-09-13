#!/bin/bash

# Wrestling News X API Server Startup Script
echo "🚀 Starting Wrestling News X API Server..."
echo "================================================"

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Check if Flask is installed
if ! python3 -c "import flask" &> /dev/null; then
    echo "📦 Installing required packages..."
    pip3 install flask flask-cors requests
fi

# Navigate to the scripts directory
cd "$(dirname "$0")/scripts"

# Start the server
echo "🌐 Starting server on http://localhost:5000"
echo "📊 API endpoint: http://localhost:5000/api/tweets"
echo "💡 To use real X posts, set TWITTER_BEARER_TOKEN environment variable"
echo "🛑 Press Ctrl+C to stop the server"
echo "================================================"

python3 local_server.py
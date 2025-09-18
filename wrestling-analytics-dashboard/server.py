#!/usr/bin/env python3
"""
Simple HTTP server to serve the wrestling match database website locally.
Run this script and then open http://localhost:8000 in your browser.
"""

import http.server
import socketserver
import os
from pathlib import Path

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler that adds CORS headers for local development."""

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_GET(self):
        # Handle root path by serving index.html
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

def main():
    """Start the web server."""
    port = 8000

    # Change to the script directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)

    handler = CORSRequestHandler

    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            print("\n🚀 Wrestling Match Database Server Started!")
            print("📁 Serving files from:", script_dir)
            print(f"🌐 Open your browser and go to: http://localhost:{port}")
            print("💡 Press Ctrl+C to stop the server")
            print("\n📊 Database Statistics:")
            if Path('wrestling_data.json').exists():
                import json
                with open('wrestling_data.json', 'r') as f:
                    data = json.load(f)
                    stats = data.get('stats', {})
                    print(f"   • Total Wrestlers: {stats.get('totalWrestlers', 0):,}")
                    print(f"   • Total Matches: {stats.get('totalMatches', 0):,}")
                    print(f"   • Avg Matches/Wrestler: {stats.get('avgMatchesPerWrestler', 0):,}")
            else:
                print("   • No data file found. Run 'python3 process_csv_data.py' first!")

            httpd.serve_forever()

    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {port} is already in use. Try a different port or kill the existing process.")
        else:
            print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    main()

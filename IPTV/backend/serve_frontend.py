#!/usr/bin/env python3
"""Simple HTTP server to serve the frontend files."""
import http.server
import socketserver
import os
from pathlib import Path

# Get the frontend directory
FRONTEND_DIR = Path(__file__).parent.parent / 'frontend'
PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Change to frontend directory before handling request
        os.chdir(str(FRONTEND_DIR))
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom log format
        print(f"[Frontend Server] {args[0]}")

if __name__ == '__main__':
    os.chdir(str(FRONTEND_DIR))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Frontend server running at http://0.0.0.0:{PORT}")
        print(f"Access from iPhone: http://192.168.1.176:{PORT}")
        print("Press CTRL+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")


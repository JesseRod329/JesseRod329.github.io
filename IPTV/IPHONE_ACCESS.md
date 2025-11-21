# Accessing IPTV from iPhone

## Quick Access URLs

**On your iPhone, open Safari and go to:**

```
http://192.168.1.193:8080
```

**To find your Mac's current IP address:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Or run the test script:
```bash
/Users/jesse/iptv/test_connection.sh
```

Then use: `http://YOUR_MAC_IP:8080`

## Important Notes

1. **Both devices must be on the same WiFi network** (your iPhone and Mac)

2. **The frontend will automatically detect your Mac's IP** and connect to the API server

3. **If it doesn't work:**
   - Make sure both servers are running:
     ```bash
     launchctl list | grep iptv
     ```
   - Check if port 8080 is accessible:
     ```bash
     curl http://192.168.1.176:8080
     ```
   - Check if port 5001 (API) is accessible:
     ```bash
     curl http://192.168.1.176:5001/api/health
     ```

4. **If you need to change the API URL manually:**
   - Open Settings in the app (⚙️ button)
   - Change API Base URL to: `http://192.168.1.193:5001/api`
   - Click "Test Connection"

## Services Running

- **Frontend Server**: Port 8080 (serves the web interface)
- **API Server**: Port 5001 (handles data and requests)

Both services start automatically when your Mac boots and restart if they crash.


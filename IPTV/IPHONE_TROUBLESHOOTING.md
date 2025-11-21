# iPhone Connection Troubleshooting Guide

## Current Status
✅ Servers are running and accessible from Mac
✅ Firewall is disabled
✅ Ports 8080 and 5001 are listening
✅ Network IP: 192.168.1.176

## Step-by-Step Troubleshooting

### Step 1: Verify Network Connection
1. **Check WiFi**: Make sure your iPhone and Mac are on the **exact same WiFi network**
   - iPhone: Settings > WiFi > Check network name
   - Mac: System Settings > Network > WiFi > Check network name
   - They must match exactly!

### Step 2: Test Basic Connectivity
On your iPhone, try these URLs in Safari:

1. **Test Page** (simplest):
   ```
   http://192.168.1.176:8080/test.html
   ```
   This will show connection status and test both servers.

2. **Main App**:
   ```
   http://192.168.1.176:8080
   ```
   or
   ```
   http://192.168.1.176:8080/index.html
   ```

3. **Direct API Test**:
   ```
   http://192.168.1.176:5001/api/health
   ```
   Should show: `{"status":"ok"}`

### Step 3: Common Issues & Solutions

#### Issue: "Safari cannot open the page"
**Solution:**
- Make sure you're typing `http://` not `https://`
- Try clearing Safari cache: Settings > Safari > Clear History and Website Data
- Try a different browser on iPhone (Chrome, Firefox)

#### Issue: Page loads but shows errors
**Solution:**
- Open Safari Developer Console (if possible) or check Settings in the app
- Go to Settings (⚙️) in the app
- Set API URL to: `http://192.168.1.176:5001/api`
- Click "Test Connection"

#### Issue: "This site can't be reached"
**Possible causes:**
1. **Different WiFi networks** - Most common issue!
   - Verify both devices show the same network name
   - Try disconnecting and reconnecting iPhone to WiFi

2. **Router blocking local traffic**
   - Some routers have "AP Isolation" or "Client Isolation" enabled
   - Check router settings and disable if enabled
   - Look for "AP Isolation", "Wireless Isolation", or "Client Isolation"

3. **Mac's IP address changed**
   - Run on Mac: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Use the IP shown instead of 192.168.1.176

### Step 4: Advanced Troubleshooting

#### Check Mac's IP Address
Run this on your Mac:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

If it shows a different IP (not 192.168.1.176), use that IP instead.

#### Verify Servers Are Running
On Mac, run:
```bash
/Users/jesse/iptv/test_connection.sh
```

#### Check Router Settings
1. Log into your router (usually 192.168.1.1 or 192.168.0.1)
2. Look for "AP Isolation" or "Wireless Isolation"
3. **Disable** it if enabled
4. Save and restart router if needed

### Step 5: Alternative Access Methods

#### Method 1: Use Mac's Hostname
Instead of IP, try using Mac's hostname:
```bash
# Find hostname on Mac:
hostname
```

Then on iPhone try:
```
http://YOUR-MAC-HOSTNAME.local:8080
```

#### Method 2: Create a QR Code
1. Generate QR code with URL: `http://192.168.1.176:8080`
2. Scan with iPhone camera
3. Opens directly in Safari

#### Method 3: Use Another Device First
Test from another device (iPad, another phone, laptop) on same network:
- If it works there, issue is iPhone-specific
- If it doesn't work, issue is network/router

### Step 6: Verify Everything Works

**On iPhone Safari:**
1. Go to: `http://192.168.1.176:8080/test.html`
2. Should see green checkmarks for both tests
3. If tests pass, go to: `http://192.168.1.176:8080`

**If test.html shows errors:**
- Check the error message
- Verify API URL in app settings matches: `http://192.168.1.176:5001/api`

## Still Not Working?

Run this diagnostic script on your Mac:
```bash
/Users/jesse/iptv/test_connection.sh
```

Then share the output for further troubleshooting.

## Quick Checklist
- [ ] iPhone and Mac on same WiFi network
- [ ] Using `http://` not `https://`
- [ ] Mac IP is 192.168.1.176 (or correct IP)
- [ ] Servers are running (check with test script)
- [ ] Router AP Isolation is disabled
- [ ] Tried test.html page first
- [ ] Cleared Safari cache on iPhone




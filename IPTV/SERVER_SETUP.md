# IPTV Server - Keep Running Setup Guide

This guide shows you how to keep the IPTV server running continuously on your Mac, even when you're not using it.

## Option 1: Launchd Service (Recommended - Runs on Boot)

This is the best option for keeping the server running automatically.

### Setup Steps:

1. **Create logs directory:**
   ```bash
   mkdir -p /Users/jesse/iptv/logs
   ```

2. **Make the startup script executable:**
   ```bash
   chmod +x /Users/jesse/iptv/backend/start_server.sh
   ```

3. **Install the launchd service:**
   ```bash
   # Copy the plist file to LaunchAgents directory
   cp /Users/jesse/iptv/com.jesse.iptv-server.plist ~/Library/LaunchAgents/
   
   # Load the service
   launchctl load ~/Library/LaunchAgents/com.jesse.iptv-server.plist
   ```

4. **Start the service:**
   ```bash
   launchctl start com.jesse.iptv-server
   ```

### Managing the Service:

**Check if it's running:**
```bash
launchctl list | grep iptv-server
```

**Stop the service:**
```bash
launchctl stop com.jesse.iptv-server
```

**Start the service:**
```bash
launchctl start com.jesse.iptv-server
```

**Unload/Remove the service:**
```bash
launchctl unload ~/Library/LaunchAgents/com.jesse.iptv-server.plist
rm ~/Library/LaunchAgents/com.jesse.iptv-server.plist
```

**View logs:**
```bash
tail -f /Users/jesse/iptv/logs/server.log
tail -f /Users/jesse/iptv/logs/server.error.log
```

### Benefits:
- ✅ Starts automatically when your Mac boots
- ✅ Automatically restarts if the server crashes
- ✅ Runs in the background (no terminal window needed)
- ✅ Logs are saved to files

---

## Option 2: Using Screen (Simple Alternative)

If you prefer a simpler solution that doesn't require system-level setup:

1. **Install screen (if not already installed):**
   ```bash
   # Screen is usually pre-installed on macOS
   ```

2. **Start the server in a screen session:**
   ```bash
   cd /Users/jesse/iptv/backend
   screen -S iptv-server
   source venv/bin/activate
   export PORT=5001
   python app.py
   ```

3. **Detach from screen:** Press `Ctrl+A` then `D`

4. **Reattach to screen:**
   ```bash
   screen -r iptv-server
   ```

5. **List all screen sessions:**
   ```bash
   screen -ls
   ```

**Note:** This requires your Mac to stay logged in and the terminal session to remain active.

---

## Option 3: Using tmux (Alternative to Screen)

Similar to screen but with more features:

1. **Install tmux (if needed):**
   ```bash
   brew install tmux
   ```

2. **Start the server in tmux:**
   ```bash
   cd /Users/jesse/iptv/backend
   tmux new -s iptv-server
   source venv/bin/activate
   export PORT=5001
   python app.py
   ```

3. **Detach:** Press `Ctrl+B` then `D`

4. **Reattach:**
   ```bash
   tmux attach -t iptv-server
   ```

---

## Option 4: Using nohup (Basic Background Process)

Simple but less robust:

```bash
cd /Users/jesse/iptv/backend
source venv/bin/activate
export PORT=5001
nohup python app.py > ../logs/server.log 2>&1 &
```

**Note:** This won't restart if it crashes and may stop if you log out.

---

## Recommended: Option 1 (Launchd)

The launchd service is the best option because:
- It's macOS-native and designed for this purpose
- Automatically starts on boot
- Automatically restarts on crash
- Runs completely in the background
- Properly manages logs

## Troubleshooting

**If the server doesn't start:**
1. Check the logs: `tail -f /Users/jesse/iptv/logs/server.error.log`
2. Verify the script path is correct in the plist file
3. Make sure the virtual environment exists: `ls /Users/jesse/iptv/backend/venv`
4. Check if port 5001 is already in use: `lsof -i :5001`

**To change the port:**
Edit the plist file and change the PORT value, then reload:
```bash
launchctl unload ~/Library/LaunchAgents/com.jesse.iptv-server.plist
launchctl load ~/Library/LaunchAgents/com.jesse.iptv-server.plist
```

**To change environment (dev/prod):**
Edit the ENVIRONMENT value in the plist file and reload.



# Web Access Setup for IPTV Player

## Problem

When accessing the IPTV Player from `jesserodriguez.me`, you get a connection error because:
- The backend server runs on your **local Mac** (port 5001)
- The frontend on `jesserodriguez.me` tries to connect to `http://jesserodriguez.me:5001/api`
- Port 5001 is not accessible from the internet on your web server

## Solutions

### Option 1: Deploy backend to Railway (Recommended) 🚀

**Best for:** Permanent web access with minimal setup

1. **Sign up at [Railway](https://railway.app)** and connect your GitHub.
2. **Create new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `JesseRod329/JesseRod329.github.io` repo
3. **Configure service root to `IPTV/backend`:**
   - In the service settings, set the project path / root to `IPTV/backend`
4. **Configure build & start:**
   - Build command (if needed):  
     `pip install -r IPTV/backend/requirements.txt`
   - Start command:  
     `cd IPTV/backend && python app.py`
5. **Set environment variables in Railway:**
   - `ENVIRONMENT=prod`
   - `IPTV_PASSWORD=12345678`
6. **Deploy** and copy the public URL, e.g.:  
   `https://iptv-backend.up.railway.app`
7. **Wire the frontend to Railway:**
   - Edit `IPTV/frontend/index.html` and set:
   ```html
   <script>
       window.IPTV_REMOTE_API_BASE = 'https://iptv-backend.up.railway.app/api';
   </script>
   ```
   - Commit and push these changes.
8. **Verify from `jesserodriguez.me`:**
   - Open the IPTV card
   - Enter password `12345678`
   - "Test Connection" should succeed and channels should load.

---

### Option 2: Use ngrok (Quick & Easy) ⚡

**Best for:** Quick testing and temporary access

1. **Install ngrok:**
   ```bash
   brew install ngrok
   # Or download from https://ngrok.com
   ```

2. **Start your backend server:**
   ```bash
   cd /Users/jesse/iptv/backend
   source venv/bin/activate
   python app.py
   ```

3. **In a new terminal, start ngrok:**
   ```bash
   ngrok http 5001
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

5. **In the IPTV frontend Settings:**
   - Enter API URL: `https://abc123.ngrok.io/api`
   - Click "Test Connection"
   - If successful, the app will work!

**Note:** Free ngrok URLs change each time you restart. For permanent access, use Option 2.

---

### Option 2: Deploy Backend to Cloud Server (Permanent) 🚀

**Best for:** Permanent web access when you prefer other providers

#### Option 2A: Heroku

1. **Install Heroku CLI:**
   ```bash
   brew install heroku/brew/heroku
   ```

2. **Login and create app:**
   ```bash
   heroku login
   cd /Users/jesse/iptv/backend
   heroku create iptv-backend
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set IPTV_PASSWORD=12345678
   ```

4. **Deploy:**
   ```bash
   git subtree push --prefix backend heroku main
   ```

5. **Get URL:**
   ```bash
   heroku info
   # Use: https://iptv-backend.herokuapp.com/api
   ```

#### Option 2B: DigitalOcean / VPS

1. **Create a droplet/server**
2. **SSH into server**
3. **Clone repo and setup:**
   ```bash
   git clone https://github.com/JesseRod329/JesseRod329.github.io.git
   cd JesseRod329.github.io/IPTV/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   export IPTV_PASSWORD=12345678
   python app.py
   ```
4. **Use your server IP:PORT/api**

---

### Option 3: Use Your Local IP (Local Network Only) 🏠

**Best for:** Access from iPhone/iPad on same WiFi

1. **Find your Mac's local IP:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Example: 192.168.1.152
   ```

2. **In Settings, enter:**
   ```
   http://192.168.1.152:5001/api
   ```

3. **Works only on same WiFi network**

---

## Quick Setup Script (ngrok)

Create a file `start-with-ngrok.sh`:

```bash
#!/bin/bash
# Start backend and ngrok together

# Start backend in background
cd /Users/jesse/iptv/backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start ngrok
echo "Starting ngrok tunnel..."
ngrok http 5001

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
```

Make it executable:
```bash
chmod +x start-with-ngrok.sh
./start-with-ngrok.sh
```

---

## Recommended Setup

For **permanent web access**, use **Railway.app** (Option 2A):
- Free tier available
- Auto-deploys from GitHub
- HTTPS included
- Easy environment variable management
- No credit card required for basic use

For **quick testing**, use **ngrok** (Option 1):
- Instant setup
- Good for development
- Free tier available

---

## Troubleshooting

### "Connection failed: Load failed"
- Backend is not accessible from web
- Use ngrok or deploy to cloud server

### "CORS error"
- Backend CORS is configured for `*` origins
- Should work, but check backend logs

### "Password required"
- Set `IPTV_PASSWORD` environment variable on server
- Or create `backend/.env` file with password

### ngrok URL changes
- Free ngrok URLs change on restart
- Upgrade to paid plan for fixed domain
- Or use Railway/Heroku for permanent URL

---

## Next Steps

1. Choose a solution above
2. Set up the backend access
3. Update API URL in frontend Settings
4. Test connection
5. Enjoy IPTV from jesserodriguez.me! 🎉


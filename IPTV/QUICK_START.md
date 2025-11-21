# Quick Start - Push to GitHub

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `iptv-player` (or any name you want)
3. **Choose "Private"** (important!)
4. **DO NOT** check "Initialize with README"
5. Click "Create repository"

## Step 2: Push to GitHub

Run this command (replace `YOUR_USERNAME` with your GitHub username):

```bash
./PUSH_TO_GITHUB.sh YOUR_USERNAME iptv-player
```

Or manually:

```bash
git remote add origin https://github.com/YOUR_USERNAME/iptv-player.git
git branch -M main
git push -u origin main
```

## Password

- Password is set to: **12345678**
- Stored in: `backend/.env` (not committed to GitHub)
- To change: Edit `backend/.env` or set `export IPTV_PASSWORD="new-password"`

## Test Login

1. Start the backend: `cd backend && python app.py`
2. Open frontend in browser
3. You should see the login modal
4. Enter password: `12345678`


# 🚀 Deployment Guide - Wrestling News Hub

## Quick Deploy to GitHub Pages

### 1. Push Your Code
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: Wrestling News Hub with glass UI"

# Add your GitHub repository as remote
git remote add origin https://github.com/JesseRod329/stats.git

# Push to GitHub
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to your repository: https://github.com/JesseRod329/stats
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Select **main** branch and **/ (root)** folder
6. Click **Save**

### 3. Your Website Will Be Live At:
**https://jesserod329.github.io/stats/**

### 4. Enable GitHub Actions (for automatic news updates)
1. Go to **Actions** tab in your repository
2. Click **I understand my workflows, go ahead and enable them**
3. The news will update automatically every 6 hours!

## 🔧 Manual News Update
If you want to update news manually:
1. Go to **Actions** tab
2. Click **Update Wrestling News**
3. Click **Run workflow** button

## 📱 Testing Your Site
- Open https://jesserod329.github.io/stats/ in your browser
- Test on mobile and desktop
- Click articles to verify external links work
- Check that the glass UI looks great!

## 🎨 Customization
After deployment, you can:
- Edit `css/style.css` to change colors/styling
- Modify `data/raw-news.json` and `data/smackdown-news.json` for custom news
- Update `scripts/update-news.py` to add more news sources

## 🐛 Troubleshooting
- **Site not loading**: Check if GitHub Pages is enabled in Settings
- **News not updating**: Verify GitHub Actions are enabled
- **Styling issues**: Check browser console for errors
- **RSS feeds not working**: Check Actions logs for errors

## 📊 Monitoring
- **GitHub Actions**: Check the Actions tab for news update status
- **GitHub Pages**: Check the Pages tab for deployment status
- **Website**: Visit your live site to see updates

Your wrestling news hub will be fully automated and always up-to-date! 🏆

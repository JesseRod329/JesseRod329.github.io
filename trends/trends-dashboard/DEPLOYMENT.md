# 🚀 Deployment Guide

## Step-by-Step Deployment to GitHub Pages + Vercel

### 1. 📁 Create GitHub Repository

```bash
# From your trends-dashboard directory
git init
git add .
git commit -m "Initial commit: Google Trends Terminal Dashboard"

# Create repository on GitHub: https://github.com/new
# Name it: trends-dashboard
# Then push:
git remote add origin https://github.com/JesseRod329/trends-dashboard.git
git branch -M main
git push -u origin main
```

### 2. 🌐 Deploy Backend to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy the backend:**
   ```bash
   vercel --prod
   ```

3. **Note the deployment URL** (e.g., `https://trends-dashboard-api.vercel.app`)

4. **Update frontend API URL:**
   ```javascript
   // In src/services/trendsService.js
   this.apiBaseUrl = this.isProduction 
     ? 'https://YOUR-VERCEL-URL.vercel.app/api' // Replace with your URL
     : 'http://localhost:3001/api';
   ```

### 3. 🎯 Deploy Frontend to GitHub Pages

1. **Enable GitHub Pages:**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Source: "GitHub Actions"

2. **Push changes to trigger deployment:**
   ```bash
   git add .
   git commit -m "Configure production API URL"
   git push
   ```

3. **GitHub Actions will automatically:**
   - Build the React app
   - Deploy to GitHub Pages
   - Make it available at `https://trends.jesserodriguez.me`

### 4. 🔧 Configure Custom Domain (Optional)

1. **Add DNS records** to your domain provider:
   ```
   Type: CNAME
   Name: trends
   Value: jesserod329.github.io
   ```

2. **Wait for DNS propagation** (5-30 minutes)

3. **Verify HTTPS** - GitHub automatically provides SSL

### 5. 🏠 Add to Portfolio Website

Add this section to your `jesserodriguez.me` portfolio:

```html
<div class="project">
    <h3>Google Trends Terminal Dashboard</h3>
    <p>Real-time trends analysis with retro terminal interface</p>
    <div class="tech-stack">
        <span>React</span>
        <span>Node.js</span>
        <span>Google Trends API</span>
        <span>Styled Components</span>
    </div>
    <div class="links">
        <a href="https://trends.jesserodriguez.me" target="_blank">Live Demo</a>
        <a href="https://github.com/JesseRod329/trends-dashboard" target="_blank">GitHub</a>
    </div>
</div>
```

## 🎉 Result

- **Frontend**: `https://trends.jesserodriguez.me`
- **Backend**: `https://your-project.vercel.app`
- **Repository**: `https://github.com/JesseRod329/trends-dashboard`

## 🔄 Future Updates

To update the dashboard:

```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push

# Frontend automatically redeploys via GitHub Actions
# Backend redeploys via Vercel on git push
```

## 🆓 Cost Breakdown

- **GitHub Pages**: Free (static hosting)
- **Vercel**: Free tier (serverless functions)
- **Domain**: ~$10-15/year (if using custom domain)
- **Total**: **FREE** for personal projects!

## 🐛 Troubleshooting

### Backend Issues
- Check Vercel function logs
- Verify CORS settings
- Test API endpoints directly

### Frontend Issues
- Check browser console for errors
- Verify API URL configuration
- Test locally first

### DNS Issues
- Wait for propagation (up to 48 hours)
- Use DNS checker tools
- Verify CNAME record is correct

# Deployment Guide - Midas Analytics Gold Tracker

This guide will help you deploy your Gold Tracker application to various hosting platforms.

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Gold Tracker app"
   git branch -M main
   git remote add origin https://github.com/yourusername/gold-tracker.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a React app
   - Add environment variables in the Vercel dashboard:
     ```
     REACT_APP_FRED_API_KEY=your_fred_api_key
     REACT_APP_METALS_API_KEY=your_metals_api_key
     REACT_APP_ALPHA_VANTAGE_KEY=your_alpha_vantage_key
     ```
   - Click "Deploy"

3. **Your app is live!** 🎉
   - Vercel will provide you with a URL like `https://your-app-name.vercel.app`
   - Automatic deployments on every push to main branch

## 🌐 Alternative Deployment Options

### Netlify

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `build` folder
   - Or connect your GitHub repo for automatic deployments
   - Add environment variables in Site Settings > Environment Variables

### GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/gold-tracker",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

## 🔧 Environment Variables

Make sure to set these environment variables in your hosting platform:

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `REACT_APP_FRED_API_KEY` | Federal Reserve Economic Data API | [fred.stlouisfed.org](https://fred.stlouisfed.org/docs/api/api_key.html) |
| `REACT_APP_METALS_API_KEY` | Metals-API for gold prices | [metals-api.com](https://metals-api.com) |
| `REACT_APP_ALPHA_VANTAGE_KEY` | Alpha Vantage for market data | [alphavantage.co](https://www.alphavantage.co/support/#api-key) |

## 📊 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm install -g source-map-explorer
npm run build
source-map-explorer build/static/js/*.js
```

### Caching Strategy
- API responses are cached for 5 minutes
- Charts re-render only when data changes
- Images and static assets are cached by CDN

## 🔒 Security Considerations

1. **Never commit API keys**
   - Add `.env` to `.gitignore`
   - Use environment variables in production

2. **Rate Limiting**
   - FRED API: 120 requests/minute
   - Metals-API: 1,000 requests/month (free tier)
   - Alpha Vantage: 500 requests/day (free tier)

3. **CORS Configuration**
   - APIs are configured to allow requests from your domain
   - No additional CORS setup needed for most APIs

## 🐛 Troubleshooting

### Common Issues

1. **Build fails**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **API errors**
   - Check API keys are correctly set
   - Verify API rate limits
   - Check network connectivity

3. **Charts not rendering**
   - Ensure Recharts is properly installed
   - Check browser console for errors
   - Verify data format matches expected structure

### Debug Mode
```bash
# Run with debug logging
REACT_APP_DEBUG=true npm start
```

## 📈 Monitoring & Analytics

### Recommended Tools
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking (free tier available)
- **Google Analytics**: User behavior tracking

### Health Checks
- API endpoint status monitoring
- Data freshness validation
- Error rate tracking

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📱 Mobile Optimization

The app is fully responsive and optimized for:
- **Desktop**: Full dashboard with all features
- **Tablet**: Condensed layout with essential features
- **Mobile**: Stacked layout with touch-friendly controls

## 🎯 Production Checklist

- [ ] API keys configured
- [ ] Environment variables set
- [ ] Build successful
- [ ] All features working
- [ ] Mobile responsive
- [ ] Performance optimized
- [ ] Error handling in place
- [ ] Analytics configured
- [ ] Domain configured (optional)

## 🆘 Support

If you encounter issues:
1. Check the [GitHub Issues](https://github.com/yourusername/gold-tracker/issues)
2. Review the [README.md](README.md) for setup instructions
3. Check API documentation for rate limits and requirements

---

**Happy Deploying! 🚀**

# 🐦 Twitter API Setup Guide

To get your actual tweets in the ticker, you need to set up Twitter API credentials.

## Step 1: Get Twitter API Access

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Sign in with your Twitter account
3. Apply for a developer account (it's free)
4. Create a new app in the developer portal

## Step 2: Get Your API Keys

In your Twitter app dashboard, you'll need:

1. **Bearer Token** (most important for this setup)
2. **API Key** 
3. **API Secret Key**
4. **Access Token**
5. **Access Token Secret**

## Step 3: Set Environment Variables

### Option A: GitHub Actions (Recommended)
Add these to your GitHub repository secrets:

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `TWITTER_BEARER_TOKEN` = your bearer token
   - `TWITTER_API_KEY` = your API key
   - `TWITTER_API_SECRET` = your API secret
   - `TWITTER_ACCESS_TOKEN` = your access token
   - `TWITTER_ACCESS_TOKEN_SECRET` = your access token secret

### Option B: Local Testing
Create a `.env` file in the `scripts/` folder:

```bash
TWITTER_BEARER_TOKEN=your_bearer_token_here
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret_here
```

## Step 4: Test the API

Run this command to test your API setup:

```bash
cd wrestling-news/scripts
python3 twitter-api.py
```

If successful, you should see:
```
✅ Successfully fetched X real tweets!
```

## Step 5: Update GitHub Actions

The system will automatically use your API credentials when running on GitHub Actions.

## Troubleshooting

### "No Twitter API credentials found"
- Make sure you've set the environment variables correctly
- Check that your Bearer Token is valid

### "Failed to get user ID"
- Verify your Bearer Token has the correct permissions
- Make sure your Twitter app has the right access level

### "Failed to fetch tweets"
- Check that your API keys are correct
- Ensure your Twitter app has read permissions
- Verify you haven't hit rate limits

## Manual Alternative

If you can't get the API working, you can always use the manual tweet updater:
- Go to: `https://jesserod329.github.io/wrestling-news/update-tweets.html`
- Add your tweets manually
- They'll appear in the ticker immediately

## Need Help?

If you're still having issues:
1. Check the Twitter Developer documentation
2. Make sure your app has the right permissions
3. Try the manual update method as a backup

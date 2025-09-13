#!/usr/bin/env python3
"""
Auto-refresh X posts for Jesse Rodriguez
This script periodically fetches your latest X posts and updates the static JSON file.
"""

import os
import json
import requests
import time
from datetime import datetime

# Your X API configuration
TWITTER_BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAADua4AEAAAAAQ%2B66%2FOlNkkuhyHy3bzToAETX%2FCo%3DOz04SuyFaP6zn4MNvSCucTOsh7IPoRkahGtiOLNI5aXgVHELxq"
USERNAME = "JesseRodPodcast"
USER_ID = "1674599110660300803"
MAX_TWEETS = 7
REFRESH_INTERVAL = 300  # 5 minutes in seconds

def fetch_real_tweets():
    """Fetch real tweets from X API"""
    headers = {
        "Authorization": f"Bearer {TWITTER_BEARER_TOKEN}"
    }
    
    try:
        tweets_url = f"https://api.twitter.com/2/users/{USER_ID}/tweets?max_results={MAX_TWEETS}&tweet.fields=created_at"
        response = requests.get(tweets_url, headers=headers)
        
        if not response.ok:
            print(f"❌ Error fetching tweets: {response.status_code}")
            if response.status_code == 429:
                print("⏳ Rate limited - will try again later")
            return None
            
        data = response.json()
        
        if 'data' not in data:
            print("❌ No tweets data found in response")
            return None
            
        tweets = []
        for tweet in data['data']:
            tweet_url = f"https://x.com/{USERNAME}/status/{tweet['id']}"
            tweets.append({
                "text": tweet['text'],
                "url": tweet_url,
                "created_at": tweet.get('created_at', '')
            })
            
        print(f"✅ Successfully fetched {len(tweets)} real tweets!")
        return tweets
        
    except Exception as e:
        print(f"❌ Error fetching tweets: {e}")
        return None

def update_tweets_file(tweets):
    """Update the static tweets JSON file"""
    if not tweets:
        return False
        
    try:
        output_file = "../data/tweets.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(tweets, f, indent=2, ensure_ascii=False)
            
        print(f"✅ Updated {output_file} with {len(tweets)} tweets at {datetime.now().strftime('%H:%M:%S')}")
        return True
        
    except Exception as e:
        print(f"❌ Error updating file: {e}")
        return False

def main():
    print("🚀 Starting auto-refresh for @JesseRodPodcast X posts...")
    print(f"⏰ Refresh interval: {REFRESH_INTERVAL} seconds")
    print("🛑 Press Ctrl+C to stop")
    print("=" * 50)
    
    while True:
        try:
            print(f"\n🔄 Fetching posts at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}...")
            
            # Fetch real tweets
            tweets = fetch_real_tweets()
            
            if tweets:
                # Update the static file
                update_tweets_file(tweets)
            else:
                print("⏭️ Skipping update due to error")
            
            # Wait before next refresh
            print(f"⏳ Waiting {REFRESH_INTERVAL} seconds until next refresh...")
            time.sleep(REFRESH_INTERVAL)
            
        except KeyboardInterrupt:
            print("\n🛑 Stopping auto-refresh...")
            break
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            print("⏳ Waiting 60 seconds before retry...")
            time.sleep(60)

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
Fetch Real X/Twitter Posts for Jesse Rodriguez
This script fetches your actual X posts and updates the static JSON file.
"""

import os
import json
import requests
from datetime import datetime

# Your X API configuration
TWITTER_BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAADua4AEAAAAAQ%2B66%2FOlNkkuhyHy3bzToAETX%2FCo%3DOz04SuyFaP6zn4MNvSCucTOsh7IPoRkahGtiOLNI5aXgVHELxq"
USERNAME = "JesseRodPodcast"
USER_ID = "1674599110660300803"  # Your actual user ID
MAX_TWEETS = 7

def fetch_real_tweets():
    """Fetch real tweets from X API"""
    headers = {
        "Authorization": f"Bearer {TWITTER_BEARER_TOKEN}"
    }
    
    try:
        # Fetch tweets
        tweets_url = f"https://api.twitter.com/2/users/{USER_ID}/tweets?max_results={MAX_TWEETS}&tweet.fields=created_at"
        response = requests.get(tweets_url, headers=headers)
        
        if not response.ok:
            print(f"❌ Error fetching tweets: {response.status_code}")
            print(f"Response: {response.text}")
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
        print("❌ No tweets to update")
        return False
        
    try:
        # Write to the data directory
        output_file = "../data/tweets.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(tweets, f, indent=2, ensure_ascii=False)
            
        print(f"✅ Updated {output_file} with {len(tweets)} tweets")
        return True
        
    except Exception as e:
        print(f"❌ Error updating file: {e}")
        return False

def main():
    print("🚀 Fetching real X posts for @JesseRodPodcast...")
    print("=" * 50)
    
    # Fetch real tweets
    tweets = fetch_real_tweets()
    
    if tweets:
        # Update the static file
        if update_tweets_file(tweets):
            print("\n🎉 SUCCESS! Your real X posts are now available!")
            print("\n📱 Recent posts:")
            for i, tweet in enumerate(tweets[:3], 1):
                preview = tweet['text'][:80] + "..." if len(tweet['text']) > 80 else tweet['text']
                print(f"  {i}. {preview}")
            print(f"\n📊 Total posts fetched: {len(tweets)}")
        else:
            print("❌ Failed to update tweets file")
    else:
        print("❌ Failed to fetch tweets")

if __name__ == "__main__":
    main()
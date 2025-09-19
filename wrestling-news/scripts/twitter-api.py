#!/usr/bin/env python3
"""
Twitter API Integration for Wrestling News Hub
Uses official Twitter API v2 to fetch tweets from @JesseRodPodcast
"""

import requests
import json
import os
from datetime import datetime, timezone
import time

class TwitterAPI:
    def __init__(self):
        self.username = 'JesseRodPodcast'
        self.tweets = []
        
        # Try to import config file first
        try:
            from config import (
                TWITTER_BEARER_TOKEN, TWITTER_API_KEY, TWITTER_API_SECRET,
                TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET
            )
            self.bearer_token = TWITTER_BEARER_TOKEN
            self.api_key = TWITTER_API_KEY
            self.api_secret = TWITTER_API_SECRET
            self.access_token = TWITTER_ACCESS_TOKEN
            self.access_token_secret = TWITTER_ACCESS_TOKEN_SECRET
        except ImportError:
            # Fallback to environment variables
            self.bearer_token = os.getenv('TWITTER_BEARER_TOKEN')
            self.api_key = os.getenv('TWITTER_API_KEY')
            self.api_secret = os.getenv('TWITTER_API_SECRET')
            self.access_token = os.getenv('TWITTER_ACCESS_TOKEN')
            self.access_token_secret = os.getenv('TWITTER_ACCESS_TOKEN_SECRET')
        
        # API endpoints
        self.base_url = 'https://api.twitter.com/2'
        
    def get_user_id(self):
        """Get user ID from username"""
        if not self.bearer_token:
            print("❌ No Twitter Bearer Token found. Please set TWITTER_BEARER_TOKEN environment variable.")
            return None
            
        try:
            url = f"{self.base_url}/users/by/username/{self.username}"
            headers = {
                'Authorization': f'Bearer {self.bearer_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                return data['data']['id']
            else:
                print(f"❌ Failed to get user ID: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Error getting user ID: {e}")
            return None
    
    def fetch_tweets(self, user_id, max_results=10):
        """Fetch recent tweets from user"""
        if not self.bearer_token:
            print("❌ No Twitter Bearer Token found.")
            return None
            
        try:
            url = f"{self.base_url}/users/{user_id}/tweets"
            headers = {
                'Authorization': f'Bearer {self.bearer_token}',
                'Content-Type': 'application/json'
            }
            
            params = {
                'max_results': max_results,
                'tweet.fields': 'created_at,public_metrics,context_annotations',
                'exclude': 'retweets,replies'
            }
            
            response = requests.get(url, headers=headers, params=params)
            if response.status_code == 200:
                data = response.json()
                return self.process_tweets(data)
            else:
                print(f"❌ Failed to fetch tweets: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Error fetching tweets: {e}")
            return None
    
    def process_tweets(self, data):
        """Process Twitter API response into our format"""
        tweets = []
        
        for tweet in data.get('data', []):
            # Clean up the text
            text = tweet.get('text', '')
            
            # Remove URLs and hashtags for cleaner display
            import re
            text = re.sub(r'https?://\S+', '', text)  # Remove URLs
            text = re.sub(r'#\w+', '', text)  # Remove hashtags
            text = text.strip()
            
            if len(text) > 10:  # Only include substantial tweets
                tweet_data = {
                    'text': text,
                    'url': f"https://x.com/{self.username}/status/{tweet['id']}",
                    'created_at': tweet.get('created_at', datetime.now(timezone.utc).isoformat())
                }
                tweets.append(tweet_data)
        
        return tweets
    
    def create_sample_tweets(self):
        """Create sample tweets as fallback"""
        return [
            {
                'text': "🎙️ New episode dropping tomorrow! Breaking down the latest WWE storylines and what's next for CM Punk in Chicago.",
                'url': f"https://x.com/{self.username}/status/sample1",
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'text': "That AJ Lee return was INSANE! Wrestling fans, we need to talk about this game-changing moment on SmackDown.",
                'url': f"https://x.com/{self.username}/status/sample2",
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'text': "John Cena's farewell tour hits different in Chicago. The emotion, the history, the legacy. Full breakdown coming soon! 🏆",
                'url': f"https://x.com/{self.username}/status/sample3",
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'text': "Behind the scenes: Preparing for a huge interview with a wrestling industry insider. This one's going to be special! 🤼‍♂️",
                'url': f"https://x.com/{self.username}/status/sample4",
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'text': "AEW All Out predictions: Who's walking out with the gold? My thoughts on the biggest matches this weekend!",
                'url': f"https://x.com/{self.username}/status/sample5",
                'created_at': datetime.now(timezone.utc).isoformat()
            }
        ]
    
    def run(self):
        """Main execution function"""
        print(f"🐦 Fetching tweets for @{self.username}...")
        
        # Check if we have API credentials
        if not self.bearer_token:
            print("❌ No Twitter API credentials found.")
            print("Please set the TWITTER_BEARER_TOKEN environment variable.")
            print("Using sample tweets as fallback...")
            self.tweets = self.create_sample_tweets()
        else:
            # Try to fetch real tweets
            user_id = self.get_user_id()
            if user_id:
                real_tweets = self.fetch_tweets(user_id)
                if real_tweets and len(real_tweets) > 0:
                    self.tweets = real_tweets
                    print(f"✅ Successfully fetched {len(self.tweets)} real tweets!")
                else:
                    print("❌ No tweets found, using sample tweets...")
                    self.tweets = self.create_sample_tweets()
            else:
                print("❌ Could not get user ID, using sample tweets...")
                self.tweets = self.create_sample_tweets()
        
        # Save tweets
        self.save_tweets()
        return self.tweets
    
    def save_tweets(self):
        """Save tweets to JSON file"""
        with open('../data/tweets.json', 'w', encoding='utf-8') as f:
            json.dump(self.tweets, f, indent=2, ensure_ascii=False)
        print(f"💾 Saved {len(self.tweets)} tweets to data/tweets.json")

def main():
    api = TwitterAPI()
    tweets = api.run()
    print(f"📊 Final result: {len(tweets)} tweets ready for ticker")

if __name__ == "__main__":
    main()

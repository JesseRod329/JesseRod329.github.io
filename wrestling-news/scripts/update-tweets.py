#!/usr/bin/env python3
"""
Twitter/X Tweet Fetcher for Wrestling News Hub
Fetches recent tweets from @JesseRodPodcast
"""

import requests
import json
import re
from datetime import datetime, timezone
import time

class TweetFetcher:
    def __init__(self):
        self.username = 'JesseRodPodcast'
        self.tweets = []
        
    def fetch_tweets_from_rss(self):
        """Fetch tweets using multiple RSS methods"""
        try:
            # Method 1: Try RSS.app (free service)
            try:
                print("Trying RSS.app...")
                rss_url = f"https://rss.app/feeds/{self.username}.xml"
                api_url = f"https://api.rss2json.com/v1/api.json?rss_url={rss_url}"
                
                response = requests.get(api_url, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if data.get('status') == 'ok' and data.get('items'):
                        print("✅ Successfully fetched from RSS.app")
                        return self.process_rss_data(data)
            except Exception as e:
                print(f"❌ RSS.app failed: {e}")
            
            # Method 2: Try Nitter instances
            nitter_instances = [
                'https://nitter.net',
                'https://nitter.1d4.us',
                'https://nitter.cz',
                'https://nitter.fdn.fr',
                'https://nitter.unixfox.eu',
                'https://nitter.domain.glass'
            ]
            
            for instance in nitter_instances:
                try:
                    print(f"Trying {instance}...")
                    rss_url = f"{instance}/{self.username}/rss"
                    api_url = f"https://api.rss2json.com/v1/api.json?rss_url={rss_url}"
                    
                    response = requests.get(api_url, timeout=10)
                    if response.status_code == 200:
                        data = response.json()
                        if data.get('status') == 'ok' and data.get('items'):
                            print(f"✅ Successfully fetched from {instance}")
                            return self.process_rss_data(data)
                except Exception as e:
                    print(f"❌ Failed {instance}: {e}")
                    continue
            
            # Method 3: Try direct RSS from Twitter (if available)
            try:
                print("Trying direct Twitter RSS...")
                rss_url = f"https://twitrss.me/twitter_user_to_rss/?user={self.username}"
                api_url = f"https://api.rss2json.com/v1/api.json?rss_url={rss_url}"
                
                response = requests.get(api_url, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if data.get('status') == 'ok' and data.get('items'):
                        print("✅ Successfully fetched from twitrss.me")
                        return self.process_rss_data(data)
            except Exception as e:
                print(f"❌ twitrss.me failed: {e}")
                    
        except Exception as e:
            print(f"RSS fetch failed: {e}")
            
        return None
    
    def process_rss_data(self, data):
        """Process RSS data into tweet format"""
        tweets = []
        
        for item in data.get('items', [])[:10]:  # Limit to 10 most recent
            # Clean up the title (which contains the tweet text)
            text = item.get('title', '')
            
            # Remove common RSS prefixes
            text = re.sub(r'^@\w+\s*', '', text)  # Remove @username prefix
            text = re.sub(r'^\d+:\d+\s*', '', text)  # Remove time prefix
            
            # Clean up URLs and hashtags
            text = re.sub(r'https?://\S+', '', text)  # Remove URLs
            text = re.sub(r'#\w+', '', text)  # Remove hashtags
            text = text.strip()
            
            if len(text) > 10:  # Only include substantial tweets
                tweet = {
                    'text': text,
                    'url': item.get('link', ''),
                    'created_at': item.get('pubDate', datetime.now(timezone.utc).isoformat())
                }
                tweets.append(tweet)
        
        return tweets
    
    def create_sample_tweets(self):
        """Create sample wrestling-related tweets for demonstration"""
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
    
    def fetch_tweets(self):
        """Main method to fetch tweets"""
        print(f"Fetching tweets for @{self.username}...")
        
        # Try to fetch real tweets first
        real_tweets = self.fetch_tweets_from_rss()
        
        if real_tweets and len(real_tweets) > 0:
            self.tweets = real_tweets
            print(f"✅ Fetched {len(self.tweets)} real tweets")
        else:
            # Fallback to sample tweets
            self.tweets = self.create_sample_tweets()
            print(f"📝 Using {len(self.tweets)} sample tweets (real tweets unavailable)")
        
        return self.tweets
    
    def save_tweets(self):
        """Save tweets to JSON file"""
        with open('../data/tweets.json', 'w', encoding='utf-8') as f:
            json.dump(self.tweets, f, indent=2, ensure_ascii=False)
        print(f"💾 Saved {len(self.tweets)} tweets to data/tweets.json")

def main():
    fetcher = TweetFetcher()
    fetcher.fetch_tweets()
    fetcher.save_tweets()
    print("Tweet fetching complete!")

if __name__ == "__main__":
    main()

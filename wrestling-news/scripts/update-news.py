#!/usr/bin/env python3
"""
Wrestling News Aggregator
Fetches news from various wrestling RSS feeds and categorizes them for Raw vs SmackDown
"""

import feedparser
import requests
import json
import re
from datetime import datetime, timezone
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import time
import random

class WrestlingNewsAggregator:
    def __init__(self):
        self.wrestling_news = []
        self.news_by_category = {
            'wwe': [],
            'aew': [],
            'tna': [],
            'njpw': [],
            'general': []
        }
        
        # RSS feeds for wrestling news - working sources only
        self.feeds = {
            'fightful': 'https://www.fightful.com/rss.xml',
            'wrestling_inc': 'https://www.wrestlinginc.com/feed/',
            'wrestling_news': 'https://wrestlingnews.co/feed/',
            'wrestlezone': 'https://www.wrestlezone.com/feed/',
            'wrestleview': 'https://www.wrestleview.com/feed/',
            'wwe_official': 'https://www.wwe.com/rss.xml'
        }
        
        # Keywords to categorize news by promotion
        self.wwe_keywords = [
            'wwe', 'wrestlemania', 'summerslam', 'royal rumble', 'nxt', 'nxt takeover',
            'raw', 'monday night raw', 'smackdown', 'friday night smackdown',
            'wwe champion', 'wwe superstar', 'wwe news', 'wwe results'
        ]
        
        self.aew_keywords = [
            'aew', 'all elite wrestling', 'dynamite', 'rampage', 'collision', 'all out',
            'double or nothing', 'revolution', 'full gear', 'aew champion', 'aew news',
            'tony khan', 'aew results', 'aew superstar'
        ]
        
        self.tna_keywords = [
            'tna', 'impact wrestling', 'impact', 'bound for glory', 'slammiversary',
            'tna champion', 'tna news', 'tna results', 'tna superstar', 'impact results'
        ]
        
        self.njpw_keywords = [
            'njpw', 'new japan', 'wrestle kingdom', 'g1 climax', 'king of pro wrestling',
            'njpw champion', 'njpw news', 'njpw results', 'iwgp', 'new japan pro wrestling'
        ]
        
        # General wrestling keywords
        self.general_keywords = [
            'wrestling', 'champion', 'championship', 'wrestler', 'superstar',
            'pay-per-view', 'ppv', 'wrestling news', 'pro wrestling'
        ]

    def fetch_feed(self, url, max_retries=3):
        """Fetch RSS feed with retry logic"""
        for attempt in range(max_retries):
            try:
                response = requests.get(url, timeout=30)
                response.raise_for_status()
                return feedparser.parse(response.content)
            except Exception as e:
                print(f"Attempt {attempt + 1} failed for {url}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    print(f"Failed to fetch {url} after {max_retries} attempts")
                    return None

    def clean_text(self, text):
        """Clean and normalize text"""
        if not text:
            return ""
        # Remove HTML tags
        soup = BeautifulSoup(text, 'html.parser')
        text = soup.get_text()
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def extract_summary(self, entry, max_length=200):
        """Extract or generate summary from entry"""
        # Try to get summary from different fields
        summary = entry.get('summary', '') or entry.get('description', '')
        summary = self.clean_text(summary)
        
        # If no summary, try to get first paragraph of content
        if not summary and hasattr(entry, 'content'):
            for content in entry.content:
                if content.type == 'text/html':
                    soup = BeautifulSoup(content.value, 'html.parser')
                    paragraphs = soup.find_all('p')
                    if paragraphs:
                        summary = self.clean_text(paragraphs[0].get_text())
                        break
        
        # If still no summary, use title
        if not summary:
            summary = entry.get('title', '')
        
        # Truncate if too long
        if len(summary) > max_length:
            summary = summary[:max_length].rsplit(' ', 1)[0] + '...'
        
        return summary

    def categorize_news(self, title, summary, content=""):
        """Categorize news by promotion"""
        text = f"{title} {summary} {content}".lower()
        
        # Check for each promotion
        wwe_score = sum(1 for keyword in self.wwe_keywords if keyword in text)
        aew_score = sum(1 for keyword in self.aew_keywords if keyword in text)
        tna_score = sum(1 for keyword in self.tna_keywords if keyword in text)
        njpw_score = sum(1 for keyword in self.njpw_keywords if keyword in text)
        general_score = sum(1 for keyword in self.general_keywords if keyword in text)
        
        # Find the highest scoring category
        scores = {
            'wwe': wwe_score,
            'aew': aew_score,
            'tna': tna_score,
            'njpw': njpw_score,
            'general': general_score
        }
        
        # Get the category with the highest score
        max_category = max(scores, key=scores.get)
        max_score = scores[max_category]
        
        # Only categorize if there's a clear match (score > 0)
        if max_score > 0:
            return max_category
        else:
            return None

    def process_entry(self, entry, source):
        """Process a single RSS entry"""
        title = self.clean_text(entry.get('title', ''))
        if not title:
            return None
        
        summary = self.extract_summary(entry)
        link = entry.get('link', '')
        
        # Get published date
        published = entry.get('published_parsed')
        if published:
            published_at = datetime(*published[:6], tzinfo=timezone.utc).isoformat()
        else:
            published_at = datetime.now(timezone.utc).isoformat()
        
        # Categorize the news
        category = self.categorize_news(title, summary)
        if not category:
            return None
        
        return {
            'title': title,
            'summary': summary,
            'source': source,
            'url': link,
            'publishedAt': published_at,
            'category': category
        }

    def fetch_all_news(self):
        """Fetch news from all RSS feeds"""
        print("Fetching wrestling news from RSS feeds...")
        
        for feed_name, feed_url in self.feeds.items():
            print(f"Fetching from {feed_name}: {feed_url}")
            feed = self.fetch_feed(feed_url)
            
            if not feed or not feed.entries:
                print(f"No entries found in {feed_name}")
                continue
            
            print(f"Found {len(feed.entries)} entries in {feed_name}")
            
            for entry in feed.entries[:10]:  # Limit to 10 entries per feed
                news_item = self.process_entry(entry, feed_name.replace('_', ' ').title())
                if news_item:
                    category = news_item['category']
                    if category in self.news_by_category:
                        self.news_by_category[category].append(news_item)
                    self.wrestling_news.append(news_item)
            
            # Be respectful to servers
            time.sleep(1)
        
        # Sort by publication date (newest first)
        self.wrestling_news.sort(key=lambda x: x['publishedAt'], reverse=True)
        
        # Sort each category
        for category in self.news_by_category:
            self.news_by_category[category].sort(key=lambda x: x['publishedAt'], reverse=True)
            # Limit to 15 articles per category
            self.news_by_category[category] = self.news_by_category[category][:15]

    def save_news(self):
        """Save news to JSON files"""
        print(f"Saving {len(self.wrestling_news)} total wrestling articles")
        
        # Print category breakdown
        for category, articles in self.news_by_category.items():
            print(f"  {category.upper()}: {len(articles)} articles")
        
        # Save unified wrestling news
        with open('../data/wrestling-news.json', 'w', encoding='utf-8') as f:
            json.dump(self.wrestling_news, f, indent=2, ensure_ascii=False)
        
        # Also save individual category files for backward compatibility
        with open('../data/raw-news.json', 'w', encoding='utf-8') as f:
            json.dump(self.news_by_category['wwe'], f, indent=2, ensure_ascii=False)
        
        with open('../data/smackdown-news.json', 'w', encoding='utf-8') as f:
            json.dump(self.news_by_category['aew'], f, indent=2, ensure_ascii=False)

    def run(self):
        """Main execution function"""
        print("Starting wrestling news aggregation...")
        self.fetch_all_news()
        self.save_news()
        
        # Also update tweets
        print("\nUpdating tweets...")
        try:
            import subprocess
            result = subprocess.run(['python3', 'update-tweets.py'], 
                                  capture_output=True, text=True, cwd='.')
            if result.returncode == 0:
                print("✅ Tweets updated successfully")
            else:
                print(f"❌ Tweet update failed: {result.stderr}")
        except Exception as e:
            print(f"❌ Tweet update error: {e}")
        
        print("News aggregation complete!")

if __name__ == "__main__":
    aggregator = WrestlingNewsAggregator()
    aggregator.run()

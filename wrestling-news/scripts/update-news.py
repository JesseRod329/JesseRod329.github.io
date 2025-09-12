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
        self.raw_news = []
        self.smackdown_news = []
        
        # RSS feeds for wrestling news
        self.feeds = {
            'wwe_official': 'https://www.wwe.com/rss.xml',
            'pwinsider': 'https://www.pwinsider.com/feeds/rss.xml',
            'fightful': 'https://www.fightful.com/rss.xml',
            'wrestling_inc': 'https://www.wrestlinginc.com/feed/',
            'cageside_seats': 'https://www.cagesideseats.com/rss/index.xml',
            'bleacher_report': 'https://bleacherreport.com/wwe/rss',
            'sportskeeda': 'https://www.sportskeeda.com/wwe/feed',
            'wrestling_news': 'https://wrestlingnews.co/feed/'
        }
        
        # Keywords to categorize news
        self.raw_keywords = [
            'raw', 'monday night raw', 'raw results', 'raw live',
            'raw superstar', 'raw champion', 'raw women', 'raw tag team',
            'monday night', 'raw exclusive', 'raw after show'
        ]
        
        self.smackdown_keywords = [
            'smackdown', 'friday night smackdown', 'smackdown results', 'smackdown live',
            'smackdown superstar', 'smackdown champion', 'smackdown women', 'smackdown tag team',
            'friday night', 'smackdown exclusive', 'smackdown after show'
        ]
        
        # General wrestling keywords
        self.wrestling_keywords = [
            'wwe', 'wrestling', 'champion', 'championship', 'wrestler', 'superstar',
            'pay-per-view', 'ppv', 'wrestlemania', 'summerslam', 'royal rumble',
            'wrestlemania', 'nxt', 'nxt takeover', 'wrestling news', 'wwe news'
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
        """Categorize news as Raw, SmackDown, or general wrestling"""
        text = f"{title} {summary} {content}".lower()
        
        # Check for Raw keywords
        raw_score = sum(1 for keyword in self.raw_keywords if keyword in text)
        smackdown_score = sum(1 for keyword in self.smackdown_keywords if keyword in text)
        
        # Check for general wrestling keywords
        wrestling_score = sum(1 for keyword in self.wrestling_keywords if keyword in text)
        
        # If it's clearly Raw or SmackDown, categorize accordingly
        if raw_score > smackdown_score and raw_score > 0:
            return 'raw'
        elif smackdown_score > raw_score and smackdown_score > 0:
            return 'smackdown'
        elif wrestling_score > 0:
            # If it's wrestling news but not clearly Raw/SmackDown, randomly assign
            return random.choice(['raw', 'smackdown'])
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
                    if news_item['category'] == 'raw':
                        self.raw_news.append(news_item)
                    else:
                        self.smackdown_news.append(news_item)
            
            # Be respectful to servers
            time.sleep(1)
        
        # Sort by publication date (newest first)
        self.raw_news.sort(key=lambda x: x['publishedAt'], reverse=True)
        self.smackdown_news.sort(key=lambda x: x['publishedAt'], reverse=True)
        
        # Limit to 20 articles per category
        self.raw_news = self.raw_news[:20]
        self.smackdown_news = self.smackdown_news[:20]

    def save_news(self):
        """Save news to JSON files"""
        print(f"Saving {len(self.raw_news)} Raw articles and {len(self.smackdown_news)} SmackDown articles")
        
        with open('data/raw-news.json', 'w', encoding='utf-8') as f:
            json.dump(self.raw_news, f, indent=2, ensure_ascii=False)
        
        with open('data/smackdown-news.json', 'w', encoding='utf-8') as f:
            json.dump(self.smackdown_news, f, indent=2, ensure_ascii=False)

    def run(self):
        """Main execution function"""
        print("Starting wrestling news aggregation...")
        self.fetch_all_news()
        self.save_news()
        print("News aggregation complete!")

if __name__ == "__main__":
    aggregator = WrestlingNewsAggregator()
    aggregator.run()

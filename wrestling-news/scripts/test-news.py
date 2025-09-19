#!/usr/bin/env python3
"""
Test script for the wrestling news aggregator
Run this locally to test the news fetching functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import importlib.util
import sys

# Import the update-news module
spec = importlib.util.spec_from_file_location("update_news", "update-news.py")
update_news = importlib.util.module_from_spec(spec)
sys.modules["update_news"] = update_news
spec.loader.exec_module(update_news)

WrestlingNewsAggregator = update_news.WrestlingNewsAggregator

def main():
    print("🧪 Testing Wrestling News Aggregator")
    print("=" * 50)
    
    aggregator = WrestlingNewsAggregator()
    
    # Test with a single feed first
    print("Testing single feed...")
    test_feed = "https://www.wwe.com/rss.xml"
    feed = aggregator.fetch_feed(test_feed)
    
    if feed and feed.entries:
        print(f"✅ Successfully fetched {len(feed.entries)} entries from WWE.com")
        
        # Test processing a few entries
        for i, entry in enumerate(feed.entries[:3]):
            print(f"\n--- Entry {i+1} ---")
            news_item = aggregator.process_entry(entry, "WWE.com")
            if news_item:
                print(f"Title: {news_item['title']}")
                print(f"Category: {news_item['category']}")
                print(f"Source: {news_item['source']}")
                print(f"Summary: {news_item['summary'][:100]}...")
            else:
                print("❌ Failed to process entry")
    else:
        print("❌ Failed to fetch test feed")
    
    print("\n" + "=" * 50)
    print("Running full aggregation...")
    
    # Run full aggregation
    aggregator.run()
    
    print(f"\n📊 Results:")
    print(f"Total wrestling articles: {len(aggregator.wrestling_news)}")
    
    for category, articles in aggregator.news_by_category.items():
        print(f"{category.upper()}: {len(articles)} articles")
    
    print(f"\n🏆 Latest wrestling news by category:")
    for category, articles in aggregator.news_by_category.items():
        if articles:
            print(f"\n{category.upper()}:")
            for article in articles[:2]:
                print(f"  • {article['title']} ({article['source']})")

if __name__ == "__main__":
    main()

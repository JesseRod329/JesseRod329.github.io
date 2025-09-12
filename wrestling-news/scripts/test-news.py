#!/usr/bin/env python3
"""
Test script for the wrestling news aggregator
Run this locally to test the news fetching functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from update_news import WrestlingNewsAggregator

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
    print(f"Raw articles: {len(aggregator.raw_news)}")
    print(f"SmackDown articles: {len(aggregator.smackdown_news)}")
    
    if aggregator.raw_news:
        print(f"\n🔴 Latest Raw news:")
        for article in aggregator.raw_news[:3]:
            print(f"  • {article['title']} ({article['source']})")
    
    if aggregator.smackdown_news:
        print(f"\n🔵 Latest SmackDown news:")
        for article in aggregator.smackdown_news[:3]:
            print(f"  • {article['title']} ({article['source']})")

if __name__ == "__main__":
    main()

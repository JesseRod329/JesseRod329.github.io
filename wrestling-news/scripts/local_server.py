#!/usr/bin/env python3
"""
Local X/Twitter API Server for Wrestling News Hub
This server provides a local API endpoint for fetching X posts without requiring Heroku deployment.
"""

import os
import json
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Configuration
TWITTER_USERNAME = "JesseRodPodcast"
MAX_TWEETS = 5

# Sample tweets data (you can replace this with real data)
SAMPLE_TWEETS = [
    {
        "text": "🎙️ New episode dropping tomorrow! Breaking down the latest WWE storylines and what's next for CM Punk in Chicago. #WWE #Wrestling",
        "url": "https://x.com/JesseRodPodcast/status/123456789",
        "created_at": "2024-09-12T10:00:00Z"
    },
    {
        "text": "That AJ Lee return was INSANE! Wrestling fans, we need to talk about this game-changing moment on SmackDown. #SmackDown #AJLee",
        "url": "https://x.com/JesseRodPodcast/status/123456790",
        "created_at": "2024-09-12T08:00:00Z"
    },
    {
        "text": "John Cena's farewell tour hits different in Chicago. The emotion, the history, the legacy. Full breakdown coming soon! 🏆 #JohnCena #WWE",
        "url": "https://x.com/JesseRodPodcast/status/123456791",
        "created_at": "2024-09-11T15:00:00Z"
    },
    {
        "text": "Behind the scenes: Preparing for a huge interview with a wrestling industry insider. This one's going to be special! 🤼‍♂️ #WrestlingInterview",
        "url": "https://x.com/JesseRodPodcast/status/123456792",
        "created_at": "2024-09-11T12:00:00Z"
    },
    {
        "text": "The wrestling world is buzzing with excitement! Can't wait to share my thoughts on the latest developments. Stay tuned! #WrestlingNews",
        "url": "https://x.com/JesseRodPodcast/status/123456793",
        "created_at": "2024-09-10T18:00:00Z"
    }
]

def get_real_tweets():
    """
    Attempt to fetch real tweets from X API.
    Returns sample data if API is not available.
    """
    twitter_bearer_token = os.environ.get('TWITTER_BEARER_TOKEN')
    
    if not twitter_bearer_token:
        print("No Twitter Bearer Token found, using sample data")
        return SAMPLE_TWEETS
    
    try:
        # Get user ID first
        user_url = f"https://api.twitter.com/2/users/by/username/{TWITTER_USERNAME}"
        headers = {"Authorization": f"Bearer {twitter_bearer_token}"}
        
        user_response = requests.get(user_url, headers=headers)
        if not user_response.ok:
            print(f"Failed to get user info: {user_response.status_code}")
            return SAMPLE_TWEETS
            
        user_data = user_response.json()
        if 'data' not in user_data:
            print("No user data found")
            return SAMPLE_TWEETS
            
        user_id = user_data['data']['id']
        
        # Get tweets
        tweets_url = f"https://api.twitter.com/2/users/{user_id}/tweets?max_results={MAX_TWEETS}&tweet.fields=created_at"
        tweets_response = requests.get(tweets_url, headers=headers)
        
        if not tweets_response.ok:
            print(f"Failed to get tweets: {tweets_response.status_code}")
            return SAMPLE_TWEETS
            
        tweets_data = tweets_response.json()
        
        if 'data' not in tweets_data:
            print("No tweets data found")
            return SAMPLE_TWEETS
            
        formatted_tweets = []
        for tweet in tweets_data['data']:
            tweet_url = f"https://x.com/{TWITTER_USERNAME}/status/{tweet['id']}"
            formatted_tweets.append({
                "text": tweet['text'],
                "url": tweet_url,
                "created_at": tweet.get('created_at', '')
            })
            
        print(f"Successfully fetched {len(formatted_tweets)} real tweets")
        return formatted_tweets
        
    except Exception as e:
        print(f"Error fetching real tweets: {e}")
        return SAMPLE_TWEETS

@app.route('/api/tweets', methods=['GET'])
def get_tweets():
    """API endpoint to get tweets"""
    try:
        # Get tweets (real or sample)
        tweets = get_real_tweets()
        
        # Add some randomization to make it feel more dynamic
        import random
        random.shuffle(tweets)
        
        return jsonify(tweets)
        
    except Exception as e:
        print(f"Error in get_tweets: {e}")
        return jsonify({"error": f"Failed to fetch tweets: {e}"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Wrestling News X API"
    })

@app.route('/', methods=['GET'])
def home():
    """Home endpoint with API info"""
    return jsonify({
        "message": "Wrestling News X API Server",
        "endpoints": {
            "/api/tweets": "GET - Fetch latest tweets",
            "/api/health": "GET - Health check"
        },
        "username": TWITTER_USERNAME,
        "max_tweets": MAX_TWEETS
    })

if __name__ == '__main__':
    print("🚀 Starting Wrestling News X API Server...")
    print(f"📱 Username: {TWITTER_USERNAME}")
    print(f"🔢 Max tweets: {MAX_TWEETS}")
    print("🌐 Server will be available at: http://localhost:5000")
    print("📊 API endpoint: http://localhost:5000/api/tweets")
    print("💡 To use real tweets, set TWITTER_BEARER_TOKEN environment variable")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
import os
import requests
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/api/tweets', methods=['GET'])
def get_tweets():
    twitter_bearer_token = os.environ.get('TWITTER_BEARER_TOKEN')
    if not twitter_bearer_token:
        return jsonify({"error": "Twitter Bearer Token not configured."}), 500

    username = "JesseRodPodcast" # This can be made dynamic if needed
    max_results = 5
    twitter_api_url = f"https://api.twitter.com/2/users/by/username/{username}/tweets?max_results={max_results}"

    headers = {
        "Authorization": f"Bearer {twitter_bearer_token}"
    }

    try:
        response = requests.get(twitter_api_url, headers=headers)
        response.raise_for_status()  # Raise an exception for HTTP errors
        tweets_data = response.json()

        # Extract and format tweets as needed by the frontend
        # The frontend expects an array of objects with 'text' and 'url'
        formatted_tweets = []
        if 'data' in tweets_data:
            for tweet in tweets_data['data']:
                # Construct the URL for the tweet
                tweet_url = f"https://twitter.com/{username}/status/{tweet['id']}"
                formatted_tweets.append({
                    "text": tweet['text'],
                    "url": tweet_url,
                    "created_at": tweet.get('created_at') # Include if needed, though frontend doesn't use it currently
                })
        
        return jsonify(formatted_tweets)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch tweets from Twitter API: {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500

if __name__ == '__main__':
    # For development, you can run this with `python scripts/app.py`
    # In production, use a WSGI server like Gunicorn or uWSGI
    app.run(debug=True, port=5000)

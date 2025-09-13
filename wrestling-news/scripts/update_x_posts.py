import os
import json
import requests
from datetime import datetime, timezone

# Configuration
USERNAME = "JesseRodPodcast"
TWEETS_FILE = "data/tweets.json"
X_BEARER_TOKEN = os.getenv("X_BEARER_TOKEN")

def fetch_x_user_id(username):
    """Fetches the user ID for a given username."""
    url = f"https://api.twitter.com/2/users/by/username/{username}"
    headers = {"Authorization": f"Bearer {X_BEARER_TOKEN}"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()["data"]["id"]

def fetch_x_posts(user_id, max_results=5):
    """Fetches recent posts for a given user ID."""
    url = f"https://api.twitter.com/2/users/{user_id}/tweets"
    headers = {"Authorization": f"Bearer {X_BEARER_TOKEN}"}
    params = {
        "max_results": max_results,
        "tweet.fields": "created_at",
        "expansions": "author_id",
    }
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()

def format_posts_for_ticker(posts_data):
    """Formats X API response into the structure expected by the news ticker."""
    formatted_tweets = []
    if "data" not in posts_data:
        return formatted_tweets

    for tweet in posts_data["data"]:
        # Construct the tweet URL
        tweet_url = f"https://x.com/{USERNAME}/status/{tweet['id']}"
        
        formatted_tweets.append({
            "text": tweet["text"],
            "url": tweet_url,
            "created_at": tweet["created_at"]
        })
    return formatted_tweets

def main():
    if not X_BEARER_TOKEN:
        print("Error: X_BEARER_TOKEN environment variable not set.")
        exit(1)

    try:
        print(f"Fetching user ID for @{USERNAME}...")
        user_id = fetch_x_user_id(USERNAME)
        print(f"User ID for @{USERNAME}: {user_id}")

        print(f"Fetching latest posts for @{USERNAME}...")
        posts_data = fetch_x_posts(user_id)
        
        formatted_posts = format_posts_for_ticker(posts_data)

        # Ensure the data directory exists
        os.makedirs(os.path.dirname(TWEETS_FILE), exist_ok=True)

        with open(TWEETS_FILE, "w", encoding="utf-8") as f:
            json.dump(formatted_posts, f, ensure_ascii=False, indent=4)
        print(f"Successfully updated {TWEETS_FILE} with {len(formatted_posts)} posts.")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching X posts: {e}")
        if e.response is not None:
            print(f"Response status: {e.response.status_code}")
            print(f"Response body: {e.response.text}")
        exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        exit(1)

if __name__ == "__main__":
    main()

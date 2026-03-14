#!/usr/bin/env python3
import json, re, sys, urllib.parse, urllib.request
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
POSTS = ROOT / 'posts.json'

query = ' '.join(sys.argv[1:]).strip() or 'open source ai agents'
day = datetime.utcnow().strftime('%Y-%m-%d')
id_ = f"{day}-" + re.sub(r'[^a-z0-9]+', '-', query.lower()).strip('-')


def fetch_json(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode('utf-8', errors='ignore'))


def reddit_hits(q):
    url = 'https://www.reddit.com/search.json?' + urllib.parse.urlencode({
        'q': q, 'sort': 'new', 't': 'day', 'limit': 8
    })
    data = fetch_json(url, {'User-Agent': 'jesserodriguez-blog-bot/1.0'})
    out = []
    for c in data.get('data', {}).get('children', []):
        d = c.get('data', {})
        if not d.get('title') or not d.get('permalink'): continue
        out.append({
            'title': d['title'],
            'sub': d.get('subreddit', ''),
            'url': 'https://reddit.com' + d['permalink']
        })
    return out[:5]


def x_links(q):
    # no Brave API; light discovery via duckduckgo html page
    url = 'https://duckduckgo.com/html/?q=' + urllib.parse.quote(f'site:x.com {q} open source')
    html = urllib.request.urlopen(url, timeout=20).read().decode('utf-8', errors='ignore')
    links = re.findall(r'https?://x\\.com/[^\\s"\'<>]+/status/\\d+', html)
    uniq = []
    for u in links:
        if u not in uniq:
            uniq.append(u)
    return uniq[:4]


def load_posts():
    if not POSTS.exists():
        return {'posts': []}
    return json.loads(POSTS.read_text())


def save_posts(data):
    POSTS.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')


r = reddit_hits(query)
x = x_links(query)

data = load_posts()
if any(p.get('id') == id_ for p in data.get('posts', [])):
    print('already exists', id_)
    sys.exit(0)

bullets = [f"{h['title']} (r/{h['sub']})" for h in r[:3]]
if x:
    bullets.append('Conversation velocity on X is picking up around this topic.')
if not bullets:
    bullets.append('No strong fresh hits found this run — broaden query and retry.')

links = [{'label': f"Reddit: {h['sub']}", 'url': h['url']} for h in r]
links += [{'label': f'X post {i+1}', 'url': u} for i, u in enumerate(x)]

post = {
    'id': id_,
    'title': f"{query} — quick open-source update",
    'date': day,
    'summary': 'Fresh scan from Reddit + X over the last day. Short notes only: what dropped, what matters, what to try.',
    'bullets': bullets,
    'links': links[:8]
}

data['posts'] = [post] + data.get('posts', [])
save_posts(data)
print('added', id_)

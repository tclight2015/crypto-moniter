import requests
import time

SUBREDDITS = ['CryptoCurrency', 'CryptoMoonShots', 'BitcoinBeginners', 'ethfinance']
BASE = 'https://www.reddit.com'
HEADERS = {'User-Agent': 'crypto-monitor/1.0'}

def search_reddit(keywords: list[str], limit: int = 25) -> list[dict]:
    results = []
    for sub in SUBREDDITS:
        try:
            sub_results = _scrape_subreddit(sub, keywords, limit)
            results.extend(sub_results)
        except Exception as e:
            print(f"Reddit r/{sub} error: {e}")
        time.sleep(1)  # Reddit rate limit
    return results

def _scrape_subreddit(sub: str, keywords: list[str], limit: int) -> list[dict]:
    results = []
    try:
        url = f'{BASE}/r/{sub}/new.json'
        params = {'limit': limit}
        res = requests.get(url, headers=HEADERS, params=params, timeout=10)
        if res.status_code != 200:
            return []

        data = res.json()
        posts = data.get('data', {}).get('children', [])

        for item in posts:
            p = item.get('data', {})
            title = p.get('title', '')
            selftext = p.get('selftext', '')
            combined = title + ' ' + selftext

            matched = [k for k in keywords if k.lower() in combined.lower()]
            if matched:
                results.append({
                    'platform': 'Reddit',
                    'board': f'r/{sub}',
                    'author': p.get('author', '[deleted]'),
                    'title': title,
                    'preview': selftext[:200].replace('\n', ' ') if selftext else title,
                    'url': f"https://www.reddit.com{p.get('permalink', '')}",
                    'time': int(p.get('created_utc', time.time()) * 1000),
                    'matched_keywords': matched,
                })
    except Exception as e:
        print(f"Reddit r/{sub} error: {e}")
    return results

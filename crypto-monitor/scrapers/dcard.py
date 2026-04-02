import requests
import time

DCARD_FORUMS = ['money', 'cryptocurrency', 'stock', 'trending']
BASE = 'https://www.dcard.tw/service/api/v2'
HEADERS = {
    'User-Agent': 'Mozilla/5.0',
    'Referer': 'https://www.dcard.tw/',
}

def search_dcard(keywords: list[str], limit: int = 30) -> list[dict]:
    results = []
    for forum in DCARD_FORUMS:
        try:
            forum_results = _scrape_forum(forum, keywords, limit)
            results.extend(forum_results)
        except Exception as e:
            print(f"Dcard {forum} error: {e}")
        time.sleep(0.5)
    return results

def _scrape_forum(forum: str, keywords: list[str], limit: int) -> list[dict]:
    results = []
    try:
        url = f'{BASE}/forums/{forum}/posts'
        params = {'limit': limit, 'popular': 'false'}
        res = requests.get(url, headers=HEADERS, params=params, timeout=10)
        if res.status_code != 200:
            return []

        posts = res.json()
        for post in posts:
            title = post.get('title', '')
            excerpt = post.get('excerpt', '')
            combined = title + ' ' + excerpt

            matched = [k for k in keywords if k.lower() in combined.lower()]
            if matched:
                post_id = post.get('id')
                results.append({
                    'platform': 'Dcard',
                    'board': post.get('forumName', forum),
                    'author': '匿名' if post.get('anonymousSchool') else post.get('school', '匿名'),
                    'title': title,
                    'preview': excerpt[:200],
                    'url': f'https://www.dcard.tw/f/{forum}/p/{post_id}',
                    'time': _parse_dcard_time(post.get('createdAt', '')),
                    'matched_keywords': matched,
                })
    except Exception as e:
        print(f"Dcard forum {forum} error: {e}")
    return results

def _parse_dcard_time(iso_str: str) -> int:
    try:
        from datetime import datetime, timezone
        dt = datetime.fromisoformat(iso_str.replace('Z', '+00:00'))
        return int(dt.timestamp() * 1000)
    except:
        return int(time.time() * 1000)

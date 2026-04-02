import requests
from bs4 import BeautifulSoup
import time
import re
from datetime import datetime

PTT_BOARDS = ['DigiCurrency', 'Stock', 'CryptoCurrency', 'Finance']
HEADERS = {'User-Agent': 'Mozilla/5.0', 'Cookie': 'over18=1'}

def search_ptt(keywords: list[str], max_pages: int = 3) -> list[dict]:
    results = []
    for board in PTT_BOARDS:
        try:
            board_results = _scrape_board(board, keywords, max_pages)
            results.extend(board_results)
        except Exception as e:
            print(f"PTT {board} error: {e}")
    return results

def _scrape_board(board: str, keywords: list[str], max_pages: int) -> list[dict]:
    results = []
    url = f'https://www.ptt.cc/bbs/{board}/index.html'

    for _ in range(max_pages):
        try:
            res = requests.get(url, headers=HEADERS, timeout=10)
            if res.status_code != 200:
                break
            soup = BeautifulSoup(res.text, 'html.parser')

            for item in soup.select('.r-ent'):
                title_el = item.select_one('.title a')
                if not title_el:
                    continue
                title = title_el.text.strip()
                link = 'https://www.ptt.cc' + title_el['href']
                author = item.select_one('.author')
                author = author.text.strip() if author else '匿名'
                date_el = item.select_one('.date')
                date_str = date_el.text.strip() if date_el else ''

                matched = [k for k in keywords if k.lower() in title.lower()]
                if matched:
                    # 抓文章內文確認
                    preview = _get_preview(link)
                    # 再次確認內文也包含關鍵字
                    all_matched = [k for k in keywords if k.lower() in title.lower() or k.lower() in preview.lower()]
                    if all_matched:
                        results.append({
                            'platform': 'PTT',
                            'board': board,
                            'author': author,
                            'title': title,
                            'preview': preview,
                            'url': link,
                            'time': _parse_ptt_date(date_str),
                            'matched_keywords': all_matched,
                        })

            # 上一頁
            prev = soup.select_one('.btn-group-paging a:nth-child(2)')
            if prev and prev.get('href'):
                url = 'https://www.ptt.cc' + prev['href']
            else:
                break
            time.sleep(0.5)
        except Exception as e:
            print(f"PTT board {board} page error: {e}")
            break

    return results

def _get_preview(url: str) -> str:
    try:
        res = requests.get(url, headers=HEADERS, timeout=8)
        soup = BeautifulSoup(res.text, 'html.parser')
        content = soup.select_one('#main-content')
        if content:
            # 移除 meta 標籤
            for tag in content.select('.article-metaline, .article-metaline-right'):
                tag.decompose()
            text = content.get_text(separator=' ').strip()
            return text[:200].replace('\n', ' ')
    except:
        pass
    return ''

def _parse_ptt_date(date_str: str) -> int:
    """回傳 unix timestamp，失敗則回傳現在"""
    try:
        now = datetime.now()
        dt = datetime.strptime(f"{now.year}/{date_str.strip()}", "%Y/%m/%d")
        return int(dt.timestamp() * 1000)
    except:
        return int(time.time() * 1000)

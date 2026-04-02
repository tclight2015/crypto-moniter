from flask import Flask, request, jsonify, render_template
from scrapers.ptt import search_ptt
from scrapers.dcard import search_dcard
from scrapers.reddit import search_reddit
import threading
import time

app = Flask(__name__)

# 快取上次掃描結果
_cache = {
    'results': [],
    'last_scan': None,
    'scanning': False,
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/scan', methods=['POST'])
def scan():
    if _cache['scanning']:
        return jsonify({'error': '掃描中，請稍候'}), 429

    body = request.json or {}
    keywords = body.get('keywords', [])
    platforms = body.get('platforms', ['PTT', 'Dcard', 'Reddit'])

    if not keywords:
        return jsonify({'error': '請至少設定一個關鍵字'}), 400

    # 背景執行掃描
    def do_scan():
        _cache['scanning'] = True
        results = []
        try:
            if 'PTT' in platforms:
                results.extend(search_ptt(keywords))
            if 'Dcard' in platforms:
                results.extend(search_dcard(keywords))
            if 'Reddit' in platforms:
                results.extend(search_reddit(keywords))

            # 去重（同 URL）
            seen = set()
            deduped = []
            for r in results:
                if r['url'] not in seen:
                    seen.add(r['url'])
                    deduped.append(r)

            # 依時間排序
            deduped.sort(key=lambda x: x['time'], reverse=True)

            _cache['results'] = deduped
            _cache['last_scan'] = int(time.time() * 1000)
        finally:
            _cache['scanning'] = False

    thread = threading.Thread(target=do_scan)
    thread.start()

    return jsonify({'status': 'scanning'})

@app.route('/api/status')
def status():
    return jsonify({
        'scanning': _cache['scanning'],
        'last_scan': _cache['last_scan'],
        'count': len(_cache['results']),
    })

@app.route('/api/results')
def results():
    return jsonify({
        'results': _cache['results'],
        'last_scan': _cache['last_scan'],
        'count': len(_cache['results']),
    })
@app.route('/api/debug_raw')
def debug_raw():
    import requests
    results = {}
    
    # 測 PTT
    try:
        r = requests.get(
            'https://www.ptt.cc/bbs/Stock/index.html',
            headers={'User-Agent': 'Mozilla/5.0', 'Cookie': 'over18=1'},
            timeout=10
        )
        results['ptt_status'] = r.status_code
        results['ptt_len'] = len(r.text)
        results['ptt_preview'] = r.text[:300]
    except Exception as e:
        results['ptt_error'] = str(e)
    
    # 測 Dcard
    try:
        r = requests.get(
            'https://www.dcard.tw/service/api/v2/forums/stock/posts?limit=5',
            headers={'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.dcard.tw/'},
            timeout=10
        )
        results['dcard_status'] = r.status_code
        results['dcard_len'] = len(r.text)
        results['dcard_preview'] = r.text[:300]
    except Exception as e:
        results['dcard_error'] = str(e)
    
    # 測 Reddit
    try:
        r = requests.get(
            'https://www.reddit.com/r/CryptoCurrency/new.json?limit=5',
            headers={'User-Agent': 'crypto-monitor/1.0'},
            timeout=10
        )
        results['reddit_status'] = r.status_code
        results['reddit_len'] = len(r.text)
    except Exception as e:
        results['reddit_error'] = str(e)
    
    return jsonify(results)
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)

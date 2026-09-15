import { useState } from 'react';
import { copyImageToClipboard, openTweetIntent } from '../utils/share.js';

export default function ResultCard({ config, image, isLoading, onDrawAgain }) {
  const [copyStatus, setCopyStatus] = useState('idle'); // idle | copied | error

  async function handleCopy() {
    try {
      await copyImageToClipboard(image);
      setCopyStatus('copied');
      window.setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Copy image to clipboard failed', err);
      setCopyStatus('error');
    }
  }

  function handleShare() {
    openTweetIntent(config.shareTag, config.ticker, window.location.href);
  }

  return (
    <div className="result-card">
      <div className={`result-image-frame${isLoading ? ' is-loading' : ''}`}>
        {isLoading ? <div className="result-loading">🎲</div> : <img src={image} alt={`${config.ticker} result`} className="result-image" />}
      </div>

      <div className="result-actions">
        <button className="btn" onClick={handleCopy} disabled={isLoading}>
          Copy Image
        </button>
        <button className="btn" onClick={handleShare} disabled={isLoading}>
          Open X &amp; Paste
        </button>
        <button className="btn btn-primary" onClick={onDrawAgain} disabled={isLoading}>
          🔁 Draw Again
        </button>
      </div>

      {copyStatus === 'copied' && <p className="result-hint">Copied! Now paste (Ctrl/Cmd+V) into the tweet box.</p>}
      {copyStatus === 'error' && (
        <p className="result-hint result-hint-error">
          Couldn't copy automatically — long-press or right-click the image to save/copy it manually.
        </p>
      )}
    </div>
  );
}

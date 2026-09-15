import { useState } from 'react';

export default function BuySection({ config }) {
  const [copied, setCopied] = useState(false);

  async function handleCopyCa() {
    try {
      await navigator.clipboard.writeText(config.ca);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy contract address failed', err);
    }
  }

  return (
    <section className="buy-section" id="buy">
      <h2 className="section-title">Contract Address</h2>
      <div className="ca-row">
        <code className="ca-value">{config.ca}</code>
        <button className="btn" onClick={handleCopyCa}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <a className="btn btn-primary buy-button" href={config.buyUrl} target="_blank" rel="noopener noreferrer">
        Buy {config.ticker}
      </a>
    </section>
  );
}

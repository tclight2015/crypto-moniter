// Spec section 4: zero-backend share flow — copy the image to the clipboard,
// then open a prefilled X (Twitter) compose window for the user to paste into.
export async function copyImageToClipboard(imageUrl) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
}

export function buildTweetIntentUrl(shareTag, ticker, siteUrl) {
  const text = `my ${shareTag} today... check yours 👀 ${ticker}`;
  const params = new URLSearchParams({ text, url: siteUrl });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function openTweetIntent(shareTag, ticker, siteUrl) {
  window.open(buildTweetIntentUrl(shareTag, ticker, siteUrl), '_blank', 'noopener,noreferrer');
}

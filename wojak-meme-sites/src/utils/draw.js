// Spec section 2.2: pure client-side random draw, repeats allowed, no
// dedupe/history tracking.
export function drawRandomImage(imagePool) {
  const idx = Math.floor(Math.random() * imagePool.length);
  return imagePool[idx];
}

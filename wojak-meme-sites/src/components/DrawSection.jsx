import { useState } from 'react';
import DrawButton from './DrawButton.jsx';
import ResultCard from './ResultCard.jsx';
import { drawRandomImage } from '../utils/draw.js';

// Spec 2.1: brief transition on redraw, kept well under 1s so the
// interaction still feels snappy.
const DRAW_DELAY_MS = 400;

export default function DrawSection({ config }) {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleDraw() {
    setIsLoading(true);
    window.setTimeout(() => {
      setResult(drawRandomImage(config.images));
      setIsLoading(false);
    }, DRAW_DELAY_MS);
  }

  return (
    <section className="draw-section" id="draw">
      <h2 className="section-title">{config.tagText}</h2>
      {result === null ? (
        <DrawButton label={config.tagText} isLoading={isLoading} onDraw={handleDraw} />
      ) : (
        <ResultCard config={config} image={result.image} isLoading={isLoading} onDrawAgain={handleDraw} />
      )}
    </section>
  );
}

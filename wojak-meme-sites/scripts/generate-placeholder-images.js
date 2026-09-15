// Generates throwaway SVG placeholder "art" + matching JSON manifests for all
// five themes, so the draw/share flow can be built and tested before the real
// 30 AI-generated PNGs per theme exist. Safe to delete once real assets land
// (or re-run any time to reset placeholders) — see rename-assets.js for the
// script that ingests real artwork instead.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES, THEME_LABELS, THEME_ACCENT } from './themes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGES_PER_THEME = 30;

const MOCK_LINES = [
  'when the group chat goes quiet',
  'checked my phone for the 40th time',
  'still thinking about that reply from 2019',
  'ordered food just to talk to someone',
  'rehearsed a conversation that never happened',
  'said "no worries" but there were worries',
  'the WiFi is the only thing that loves me back',
  'left on read by the vending machine',
  'practiced my order out loud twice',
  'made eye contact with my reflection',
];

function buildSvg(theme, index) {
  const label = THEME_LABELS[theme];
  const accent = THEME_ACCENT[theme];
  const score = Math.floor(Math.random() * 41) + 60; // mock 60-100 score
  const line = MOCK_LINES[index % MOCK_LINES.length];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <rect width="1080" height="1080" fill="#f4f1ea" />
  <rect x="24" y="24" width="1032" height="1032" fill="none" stroke="${accent}" stroke-width="6" rx="18" />
  <circle cx="540" cy="420" r="220" fill="none" stroke="#2b2b2b" stroke-width="6" />
  <text x="540" y="410" font-family="Kalam, sans-serif" font-size="42" fill="#2b2b2b" text-anchor="middle">placeholder</text>
  <text x="540" y="470" font-family="Kalam, sans-serif" font-size="28" fill="#8a8a8a" text-anchor="middle">${label} #${String(index).padStart(2, '0')}</text>
  <text x="540" y="740" font-family="Kalam, sans-serif" font-size="64" font-weight="700" fill="${accent}" text-anchor="middle">${score}% ${label}</text>
  <text x="540" y="820" font-family="Patrick Hand, sans-serif" font-size="34" fill="#2b2b2b" text-anchor="middle">${line}</text>
</svg>`;
}

for (const theme of THEMES) {
  const imagesDir = path.join(ROOT, 'public', 'images', theme);
  fs.mkdirSync(imagesDir, { recursive: true });

  const manifest = [];
  for (let i = 1; i <= IMAGES_PER_THEME; i += 1) {
    const filename = `${theme}-${String(i).padStart(2, '0')}.svg`;
    fs.writeFileSync(path.join(imagesDir, filename), buildSvg(theme, i));
    manifest.push({ id: i, image: `/images/${theme}/${filename}` });
  }

  const dataDir = path.join(ROOT, 'src', 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(
    path.join(dataDir, `${theme}.json`),
    JSON.stringify(manifest, null, 2) + '\n'
  );

  console.log(`[placeholders] ${theme}: ${IMAGES_PER_THEME} images -> public/images/${theme}/, manifest -> src/data/${theme}.json`);
}

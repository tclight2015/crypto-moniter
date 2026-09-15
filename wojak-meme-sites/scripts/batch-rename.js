// Ingests the real AI-generated artwork per spec section 3.2:
// drop the picked, watermark-free files (any filename) into
// raw-uploads/{theme}/, then run this script. It sorts by file mtime,
// renames sequentially to {theme}-01..30, copies them into
// public/images/{theme}/, and (re)writes src/data/{theme}.json to match —
// overwriting the placeholder manifest from generate-placeholder-images.js.
//
// Usage:
//   node scripts/batch-rename.js <theme>   # e.g. node scripts/batch-rename.js lonely
//   node scripts/batch-rename.js           # process every theme with files staged
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES } from './themes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGE_EXT = /\.(png|jpe?g)$/i;

function batchRename(theme) {
  const rawDir = path.join(ROOT, 'raw-uploads', theme);
  const outputDir = path.join(ROOT, 'public', 'images', theme);
  const dataDir = path.join(ROOT, 'src', 'data');

  if (!fs.existsSync(rawDir)) {
    console.log(`[rename] skip ${theme}: no raw-uploads/${theme}/ folder`);
    return;
  }

  const files = fs
    .readdirSync(rawDir)
    .filter((f) => IMAGE_EXT.test(f))
    .sort((a, b) => fs.statSync(path.join(rawDir, a)).mtimeMs - fs.statSync(path.join(rawDir, b)).mtimeMs);

  if (files.length === 0) {
    console.log(`[rename] skip ${theme}: no image files staged in raw-uploads/${theme}/`);
    return;
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(dataDir, { recursive: true });

  const manifest = [];
  files.forEach((file, i) => {
    const ext = path.extname(file).toLowerCase();
    const newName = `${theme}-${String(i + 1).padStart(2, '0')}${ext}`;
    fs.copyFileSync(path.join(rawDir, file), path.join(outputDir, newName));
    manifest.push({ id: i + 1, image: `/images/${theme}/${newName}` });
  });

  fs.writeFileSync(
    path.join(dataDir, `${theme}.json`),
    JSON.stringify(manifest, null, 2) + '\n'
  );

  console.log(`[rename] ${theme}: ${files.length} files -> public/images/${theme}/, manifest -> src/data/${theme}.json`);
  if (files.length !== 30) {
    console.warn(`[rename] warning: expected 30 images for ${theme}, found ${files.length}`);
  }
}

const requested = process.argv[2];
const targets = requested ? [requested] : THEMES;

for (const theme of targets) {
  if (!THEMES.includes(theme)) {
    console.error(`[rename] unknown theme "${theme}". Expected one of: ${THEMES.join(', ')}`);
    process.exitCode = 1;
    continue;
  }
  batchRename(theme);
}

import lonely from './lonely.config.js';
import clueless from './clueless.config.js';
import jealous from './jealous.config.js';
import shocked from './shocked.config.js';
import swear from './swear.config.js';

const THEMES = { lonely, clueless, jealous, shocked, swear };

// Each of the 5 deployments sets VITE_THEME in its own .env (see .env.example)
// so the same build output only ever ships one theme's config + images.
const activeId = import.meta.env.VITE_THEME || 'lonely';

if (!THEMES[activeId]) {
  throw new Error(
    `Unknown VITE_THEME "${activeId}". Expected one of: ${Object.keys(THEMES).join(', ')}`
  );
}

export const activeConfig = THEMES[activeId];
export default THEMES;

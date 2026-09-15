// Section 5/7: five themes share one CSS file; only these tokens change per
// deployment. Called once on boot with the active config's colorTheme.
export function applyTheme(colorTheme) {
  const root = document.documentElement.style;
  root.setProperty('--color-primary', colorTheme.primary);
  root.setProperty('--color-accent', colorTheme.accent);
  root.setProperty('--color-bg', colorTheme.bg);
  root.setProperty('--color-text', colorTheme.text);
}

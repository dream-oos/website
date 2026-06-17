export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function systemPrefersDark(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolveTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return systemPrefersDark() ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.dataset.theme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const css = getComputedStyle(root).getPropertyValue('--color-bg').trim();
    if (css) meta.setAttribute('content', css);
  }
}

export function initTheme(): void {
  applyTheme(resolveTheme());

  if (typeof matchMedia !== 'undefined') {
    const mql = matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (!localStorage.getItem(STORAGE_KEY)) applyTheme(systemPrefersDark() ? 'dark' : 'light');
    };
    mql.addEventListener?.('change', onChange);
  }
}

export function toggleTheme(): void {
  const current = (document.documentElement.dataset.theme as Theme) ?? resolveTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
}

import type { ThemeMode } from '../models'

export function applyTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') {
    return
  }

  const resolvedTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme

  document.documentElement.dataset.theme = resolvedTheme
  document.documentElement.style.colorScheme = resolvedTheme
}

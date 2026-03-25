type Theme = 'dark' | 'light';

interface Settings {
  theme: Theme;
  labelsAlwaysOn: boolean;
  starDensity: 'sparse' | 'normal' | 'dense';
}

const STORAGE_KEY = 'solar-system-settings';

const VALID_THEMES = new Set<string>(['dark', 'light']);
const VALID_STAR_DENSITIES = new Set<string>(['sparse', 'normal', 'dense']);

function loadSettings(): Settings {
  const defaults: Settings = {
    theme: 'dark',
    labelsAlwaysOn: false,
    starDensity: 'normal',
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      // Validate each field individually rather than blindly spreading the
      // parsed object — prevents unexpected keys or type-confused values
      // from influencing application state even within same-origin context.
      const parsed: unknown = JSON.parse(stored);
      if (parsed !== null && typeof parsed === 'object') {
        const raw = parsed as Record<string, unknown>;
        if (VALID_THEMES.has(raw['theme'] as string)) {
          defaults.theme = raw['theme'] as Theme;
        }
        if (typeof raw['labelsAlwaysOn'] === 'boolean') {
          defaults.labelsAlwaysOn = raw['labelsAlwaysOn'];
        }
        if (VALID_STAR_DENSITIES.has(raw['starDensity'] as string)) {
          defaults.starDensity = raw['starDensity'] as Settings['starDensity'];
        }
      }
      return defaults;
    }
  } catch {
    // localStorage unavailable or JSON malformed
  }

  // Respect system preference
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    defaults.theme = 'light';
  }

  return defaults;
}

function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage unavailable
  }
}

let currentSettings = loadSettings();

export function getSettings(): Settings {
  return currentSettings;
}

export function setTheme(theme: Theme): void {
  currentSettings.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  saveSettings(currentSettings);
}

export function toggleLabels(on: boolean): void {
  currentSettings.labelsAlwaysOn = on;
  document.querySelector('.solar-system')?.classList.toggle('labels-always-on', on);
  saveSettings(currentSettings);
}

export function applySettings(): void {
  document.documentElement.setAttribute('data-theme', currentSettings.theme);
  if (currentSettings.labelsAlwaysOn) {
    document.querySelector('.solar-system')?.classList.add('labels-always-on');
  }
}

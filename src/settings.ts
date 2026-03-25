type Theme = 'dark' | 'light';

interface Settings {
  theme: Theme;
  labelsAlwaysOn: boolean;
  starDensity: 'sparse' | 'normal' | 'dense';
}

const STORAGE_KEY = 'solar-system-settings';

function loadSettings(): Settings {
  const defaults: Settings = {
    theme: 'dark',
    labelsAlwaysOn: false,
    starDensity: 'normal',
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaults, ...JSON.parse(stored) };
    }
  } catch {
    // localStorage unavailable
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

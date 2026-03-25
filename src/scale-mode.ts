import { domCache } from './state.ts';
import type { Planet } from './types.ts';

type ScaleMode = 'stylized' | 'logarithmic';

let currentMode: ScaleMode = 'stylized';

// Logarithmic scale distances (more usable than true linear scale)
// Maps AU to rem values using log scale
function logDistance(au: number): number {
  return 4 + Math.log2(au + 0.5) * 5;
}

// Logarithmic size ratios (so inner planets don't vanish)
function logSizeRatio(realRatio: number): number {
  return 0.3 + realRatio * 0.3;
}

export function getScaleMode(): ScaleMode {
  return currentMode;
}

export function toggleScaleMode(planets: Planet[]): ScaleMode {
  currentMode = currentMode === 'stylized' ? 'logarithmic' : 'stylized';
  applyScaleMode(planets);
  return currentMode;
}

export function applyScaleMode(planets: Planet[]): void {
  planets.forEach((planet, index) => {
    const el = domCache.planets[index];
    if (!el) return;

    if (currentMode === 'logarithmic') {
      const distance = logDistance(planet.distance);
      const size = logSizeRatio(planet.sizeRatio);
      el.style.setProperty('--distance', `${distance}rem`);
      el.style.width = `calc(var(--earth-size) * ${size})`;
      el.style.height = `calc(var(--earth-size) * ${size})`;
    } else {
      // Restore stylized values — read from CSS class
      el.style.removeProperty('--distance');
      el.style.width = `calc(var(--earth-size) * ${planet.sizeRatio})`;
      el.style.height = `calc(var(--earth-size) * ${planet.sizeRatio})`;
    }
  });

  // Add/remove class for CSS transitions
  const container = document.querySelector('.solar-system');
  if (container) {
    container.classList.toggle('scale-logarithmic', currentMode === 'logarithmic');
  }
}

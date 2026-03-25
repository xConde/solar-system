import { domCache } from './state.ts';
import type { Planet, Moon } from './types.ts';

export function createOrbitPath(planet: Planet, solarSystem: HTMLElement): HTMLDivElement {
  const orbit = document.createElement('div');
  orbit.classList.add('orbit-path');

  const tempEl = document.createElement('div');
  tempEl.classList.add('planet', planet.name);
  solarSystem.appendChild(tempEl);
  // try/finally ensures the temp element is always removed from the DOM even
  // if getComputedStyle throws (e.g. in unusual browser environments).
  let distance: string;
  try {
    distance = getComputedStyle(tempEl).getPropertyValue('--distance').trim();
  } finally {
    solarSystem.removeChild(tempEl);
  }

  const distanceValue = parseFloat(distance);
  const unit = distance.replace(/[\d.]/g, '');

  orbit.style.width = `${distanceValue * 2}${unit}`;
  orbit.style.height = `${distanceValue * 2}${unit}`;

  solarSystem.appendChild(orbit);
  return orbit;
}

export function createSun(parentElement: HTMLElement): void {
  const sunEl = document.createElement('div');
  sunEl.classList.add('sun');
  parentElement.appendChild(sunEl);
}

export function handlePlanetClick(event: Event): void {
  (event.currentTarget as HTMLElement).classList.toggle('clicked');
}

export function createPlanet(planet: Planet, solarSystem: HTMLElement): HTMLDivElement {
  const planetEl = document.createElement('div');
  planetEl.classList.add('planet', planet.name);
  solarSystem.appendChild(planetEl);

  planetEl.style.setProperty('--planet-color', planet.color);
  planetEl.style.setProperty('--planet-size', `calc(var(--earth-size) * ${planet.sizeRatio})`);
  planetEl.style.backgroundColor = planet.color;
  planetEl.style.width = `calc(var(--earth-size) * ${planet.sizeRatio})`;
  planetEl.style.height = `calc(var(--earth-size) * ${planet.sizeRatio})`;

  // Planet surface detail via gradients.
  // Safety: planet.color is interpolated directly into CSS gradient strings.
  // This is safe because planet data is hardcoded in getPlanetData(). If planet
  // data is ever sourced externally, validate/sanitize color values (e.g. against
  // a CSS color allowlist) before this interpolation.
  const gradients: Record<string, string> = {
    mercury: `radial-gradient(circle at 35% 35%, #d4d4d4, ${planet.color} 60%, #888 100%)`,
    venus: `radial-gradient(circle at 35% 35%, #f7dc6f, ${planet.color} 60%, #c8a415 100%)`,
    earth: `radial-gradient(circle at 35% 35%, #5dade2, ${planet.color} 40%, #1a5276 100%)`,
    mars: `radial-gradient(circle at 35% 35%, #f1948a, ${planet.color} 60%, #922b21 100%)`,
    jupiter: `repeating-linear-gradient(
    0deg,
    #f1c40f 0%, #d4a017 8%, #e8b30e 16%, #c8960f 24%, #f1c40f 32%
  )`,
    saturn: `repeating-linear-gradient(
    0deg,
    #e67e22 0%, #d4700a 10%, #e67e22 20%, #ca6f19 30%, #e67e22 40%
  )`,
    uranus: `radial-gradient(circle at 35% 35%, #85c1e9, ${planet.color} 60%, #2e86c1 100%)`,
    neptune: `radial-gradient(circle at 35% 35%, #7fb3d3, ${planet.color} 60%, #2c3e50 100%)`,
  };

  if (gradients[planet.name]) {
    planetEl.style.background = gradients[planet.name];
  }

  const glows: Record<string, string> = {
    earth: '0 0 8px rgba(52, 152, 219, 0.6), 0 0 15px rgba(52, 152, 219, 0.3)',
    mars: '0 0 6px rgba(231, 76, 60, 0.4)',
    jupiter: '0 0 12px rgba(241, 196, 15, 0.3)',
    saturn: '0 0 10px rgba(230, 126, 34, 0.3)',
    neptune: '0 0 8px rgba(74, 111, 141, 0.5)',
    uranus: '0 0 8px rgba(93, 166, 225, 0.4)',
  };

  if (glows[planet.name]) {
    planetEl.style.boxShadow = glows[planet.name];
  }

  const label = document.createElement('div');
  label.classList.add('planet-label');
  // Safe: planet.name comes from hardcoded getPlanetData(), never from user input.
  // If this data source ever changes to accept external input, sanitize before assignment.
  label.innerText = planet.name;
  planetEl.appendChild(label);

  const rotationCounterEl = document.createElement('div');
  rotationCounterEl.classList.add('rotation-counter');
  const counterSize = Math.max(Math.min(planet.sizeRatio * 3, 16), 12);
  rotationCounterEl.style.fontSize = `${counterSize}px`;
  rotationCounterEl.innerText = '';
  planetEl.appendChild(rotationCounterEl);

  planetEl.setAttribute('aria-label', `Planet ${planet.name}`);
  planetEl.setAttribute('tabindex', '0');
  planetEl.setAttribute('role', 'button');

  planetEl.addEventListener('click', handlePlanetClick);
  planetEl.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      planetEl.classList.toggle('clicked');
    }
  });
  // Tracks the last time an announcement was made for this planet.
  // Prevents aria-live spam on fast-orbiting planets like Mercury.
  const ANNOUNCE_MIN_INTERVAL_MS = 5000;
  let lastAnnouncedAt = 0;

  planetEl.addEventListener('animationiteration', () => {
    const currentValue = parseInt(rotationCounterEl.innerText, 10) || 0;
    const newValue = currentValue + 1;
    rotationCounterEl.innerText = String(newValue);
    const now = Date.now();
    if (now - lastAnnouncedAt >= ANNOUNCE_MIN_INTERVAL_MS) {
      const announcer = document.getElementById('rotation-announcer');
      if (announcer) {
        announcer.textContent = `${planet.name} completed orbit ${newValue}`;
        lastAnnouncedAt = now;
      }
    }
  });

  return planetEl;
}

export function createMoons(planet: Planet, planetEl: HTMLDivElement, scalingFactor: number): void {
  planet.moons.forEach((moon: Moon) => {
    const moonEl = document.createElement('div');
    moonEl.classList.add('moon', `moon-${moon.name}`);
    planetEl.appendChild(moonEl);
    moonEl.style.setProperty('--distance', moon.distance / (scalingFactor * 2) + 'em');
    moonEl.style.backgroundColor = moon.color;
    moonEl.style.width = `calc(var(--luna-moon-size) * ${moon.sizeRatio})`;
    moonEl.style.height = `calc(var(--luna-moon-size) * ${moon.sizeRatio})`;
    domCache.moons[moon.name] = moonEl;
    moonEl.style.opacity = '1';
  });
  planetEl.style.opacity = '1';
}

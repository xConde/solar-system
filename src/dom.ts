import { domCache } from './state.ts';
import type { Planet, Moon } from './types.ts';

export function createOrbitPath(planet: Planet, solarSystem: HTMLElement): HTMLDivElement {
  const orbit = document.createElement('div');
  orbit.classList.add('orbit-path');

  const tempEl = document.createElement('div');
  tempEl.classList.add('planet', planet.name);
  solarSystem.appendChild(tempEl);
  const distance = getComputedStyle(tempEl).getPropertyValue('--distance').trim();
  solarSystem.removeChild(tempEl);

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

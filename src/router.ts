import type { Planet } from './types.ts';
import { domCache } from './state.ts';
import { showInfoPanel } from './panel.ts';
import { zoomToElement } from './viewport.ts';
import { isTourActive } from './tour.ts';

let planets: Planet[] = [];
let container: HTMLElement | null = null;
let panel: HTMLDivElement | null = null;

export function initRouter(
  solarSystem: HTMLElement,
  planetData: Planet[],
  infoPanel: HTMLDivElement
): void {
  planets = planetData;
  container = solarSystem;
  panel = infoPanel;

  // Handle initial hash
  handleHash();

  // Listen for hash changes
  window.addEventListener('hashchange', handleHash);
}

function handleHash(): void {
  // Do not interrupt an active tour — the tour controls its own panel and
  // viewport state. Accepting a hash change mid-tour would leave the tour
  // overlay in an inconsistent state.
  if (isTourActive()) return;

  const hash = window.location.hash.slice(1).toLowerCase();
  if (!hash || !container || !panel) return;

  const planetIndex = planets.findIndex(p => p.name === hash);
  if (planetIndex === -1) return;

  const planet = planets[planetIndex];
  const planetEl = domCache.planets[planetIndex];

  if (planetEl) {
    zoomToElement(container, planetEl);
    showInfoPanel(panel, planet);
  }
}

export function navigateTo(planetName: string): void {
  window.location.hash = planetName;
}

export function createShareUrl(planetName: string): string {
  return `${window.location.origin}${window.location.pathname}#${planetName}`;
}

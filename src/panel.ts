import type { Planet } from './types.ts';

let currentPanel: HTMLDivElement | null = null;
let currentPlanetName: string | null = null;
// Tracks whether the global Escape key listener has been registered.
// createInfoPanel must only be called once; this flag prevents a duplicate
// listener if that invariant is ever accidentally broken.
let escapeListenerRegistered = false;

export function createInfoPanel(): HTMLDivElement {
  const panel = document.createElement('div');
  panel.classList.add('info-panel');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Planet information');
  // Safety: this is a fully static template string — no dynamic data is
  // interpolated here, so there is no XSS risk despite the use of innerHTML.
  panel.innerHTML = `
    <button class="info-panel-close" aria-label="Close panel">&times;</button>
    <h2 class="info-panel-title"></h2>
    <dl class="info-panel-data"></dl>
    <p class="info-panel-fact"></p>
  `;

  const closeBtn = panel.querySelector('.info-panel-close') as HTMLButtonElement;
  closeBtn.addEventListener('click', () => hideInfoPanel());

  // Guard against duplicate global listeners if createInfoPanel is ever called
  // more than once (e.g. during tests or future refactors).
  if (!escapeListenerRegistered) {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') hideInfoPanel();
    });
    escapeListenerRegistered = true;
  }

  return panel;
}

export function showInfoPanel(panel: HTMLDivElement, planet: Planet): void {
  if (!planet.info) return;

  // Toggle: clicking the same planet again closes the panel
  if (currentPlanetName === planet.name && panel.classList.contains('info-panel--visible')) {
    hideInfoPanel();
    return;
  }

  const title = panel.querySelector('.info-panel-title') as HTMLHeadingElement;
  const data = panel.querySelector('.info-panel-data') as HTMLDListElement;
  const fact = panel.querySelector('.info-panel-fact') as HTMLParagraphElement;

  title.textContent = planet.name.charAt(0).toUpperCase() + planet.name.slice(1);
  if (planet.type === 'dwarf-planet') {
    const badge = document.createElement('span');
    badge.classList.add('info-panel-badge');
    badge.textContent = 'Dwarf Planet';
    title.appendChild(badge);
  }

  // Clear previous entries. Empty string is safe; planet data is written via
  // textContent below, never via innerHTML.
  data.innerHTML = '';
  const fields: [string, string][] = [
    ['Diameter', planet.info.diameter],
    ['Distance from Sun', planet.info.distanceFromSun],
    ['Orbital Period', planet.info.orbitalPeriod],
    ['Moons', String(planet.info.numberOfMoons)],
  ];

  fields.forEach(([label, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    data.appendChild(dt);
    data.appendChild(dd);
  });

  fact.textContent = planet.info.funFact;

  // Remove existing share button if any
  const existingShare = panel.querySelector('.info-panel-share');
  if (existingShare) existingShare.remove();

  const shareBtn = document.createElement('button');
  shareBtn.classList.add('info-panel-share');
  shareBtn.textContent = 'Copy Link';
  shareBtn.addEventListener('click', () => {
    const url = `${window.location.origin}${window.location.pathname}#${planet.name}`;
    navigator.clipboard.writeText(url).then(() => {
      shareBtn.textContent = 'Copied!';
      setTimeout(() => { shareBtn.textContent = 'Copy Link'; }, 2000);
    }).catch(() => {
      // Fallback: select text
      shareBtn.textContent = url;
    });
  });
  panel.appendChild(shareBtn);

  panel.classList.add('info-panel--visible');
  currentPanel = panel;
  currentPlanetName = planet.name;
}

export function hideInfoPanel(): void {
  if (currentPanel) {
    currentPanel.classList.remove('info-panel--visible');
    currentPanel = null;
    currentPlanetName = null;
  }
}

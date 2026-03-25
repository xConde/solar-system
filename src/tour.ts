import type { Planet } from './types.ts';
import { domCache } from './state.ts';
import { showInfoPanel, hideInfoPanel } from './panel.ts';
import { zoomToElement, resetViewport } from './viewport.ts';

interface TourState {
  active: boolean;
  currentStep: number;
  planets: Planet[];
  container: HTMLElement;
  panel: HTMLDivElement;
  overlay: HTMLDivElement | null;
}

const state: TourState = {
  active: false,
  currentStep: -1,
  planets: [],
  container: null as unknown as HTMLElement,
  panel: null as unknown as HTMLDivElement,
  overlay: null,
};

export function initTour(container: HTMLElement, planets: Planet[], panel: HTMLDivElement): void {
  state.container = container;
  state.planets = planets;
  state.panel = panel;
}

export function startTour(): void {
  if (state.active) return;
  state.active = true;
  state.currentStep = -1;

  // Create overlay
  state.overlay = document.createElement('div');
  state.overlay.classList.add('tour-overlay');
  state.overlay.innerHTML = `
    <div class="tour-progress"></div>
    <div class="tour-controls">
      <button class="tour-btn tour-btn--prev" aria-label="Previous">Prev</button>
      <span class="tour-step-indicator"></span>
      <button class="tour-btn tour-btn--next" aria-label="Next">Next</button>
      <button class="tour-btn tour-btn--exit" aria-label="Exit tour">Exit</button>
    </div>
  `;

  document.body.appendChild(state.overlay);

  const prevBtn = state.overlay.querySelector('.tour-btn--prev') as HTMLButtonElement;
  const nextBtn = state.overlay.querySelector('.tour-btn--next') as HTMLButtonElement;
  const exitBtn = state.overlay.querySelector('.tour-btn--exit') as HTMLButtonElement;

  prevBtn.addEventListener('click', prevStep);
  nextBtn.addEventListener('click', nextStep);
  exitBtn.addEventListener('click', endTour);

  // Start with first step
  nextStep();
}

function nextStep(): void {
  state.currentStep++;
  if (state.currentStep >= state.planets.length) {
    endTour();
    return;
  }
  goToStep(state.currentStep);
}

function prevStep(): void {
  if (state.currentStep <= 0) return;
  state.currentStep--;
  goToStep(state.currentStep);
}

function goToStep(step: number): void {
  const planet = state.planets[step];
  const planetEl = domCache.planets[step];

  if (!planetEl) return;

  // Update progress
  const indicator = state.overlay?.querySelector('.tour-step-indicator');
  if (indicator) {
    indicator.textContent = `${step + 1} / ${state.planets.length}`;
  }

  const progress = state.overlay?.querySelector('.tour-progress') as HTMLDivElement | null;
  if (progress) {
    progress.style.width = `${((step + 1) / state.planets.length) * 100}%`;
  }

  // Dim non-focused planets, show label on focused one
  domCache.planets.forEach((el, i) => {
    if (i === step) {
      el.style.opacity = '1';
      el.classList.remove('tour-dimmed');
      el.classList.add('clicked');
    } else {
      el.style.opacity = '0.2';
      el.classList.add('tour-dimmed');
      el.classList.remove('clicked');
    }
  });

  // Zoom to planet and show info
  zoomToElement(state.container, planetEl);
  showInfoPanel(state.panel, planet);
}

export function endTour(): void {
  if (!state.active) return;
  state.active = false;

  // Restore planet opacities and remove tour state
  domCache.planets.forEach((el) => {
    el.style.opacity = '1';
    el.classList.remove('tour-dimmed');
    el.classList.remove('clicked');
  });

  // Remove overlay
  if (state.overlay) {
    state.overlay.remove();
    state.overlay = null;
  }

  hideInfoPanel();
  resetViewport(state.container);
}

export function isTourActive(): boolean {
  return state.active;
}

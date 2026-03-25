import './styles.css';
import { initPerformanceMonitoring } from './performance.ts';
import { getPlanetData } from './data.ts';
import { createSun, createPlanet, createMoons, createOrbitPath } from './dom.ts';
import { createInfoPanel, showInfoPanel } from './panel.ts';
import { initStarfield, handleStarfieldResize, pauseStarfield, resumeStarfield } from './stars.ts';
import {
  initAsteroidBelt,
  handleAsteroidResize,
  pauseAsteroids,
  resumeAsteroids,
} from './asteroids.ts';
import { initComets, handleCometResize, pauseComets, resumeComets } from './comets.ts';
import {
  updateResponsiveProperties,
  calculateScalingFactor,
  positionElement,
  rotateElement,
  applyScalingAndReposition,
  scheduleCheck,
  throttle,
} from './scaling.ts';
import { domCache } from './state.ts';
import { createControlBar, initKeyboardShortcuts } from './controls.ts';
import { initViewport, resetViewport, zoomToElement, getScale } from './viewport.ts';
import { toggleScaleMode } from './scale-mode.ts';
import { initTour, startTour } from './tour.ts';
import { initRouter } from './router.ts';
import { applySettings, setTheme, getSettings, toggleLabels } from './settings.ts';

document.addEventListener('DOMContentLoaded', function () {
  // Apply saved settings before rendering
  applySettings();

  const planets = getPlanetData();
  const solarSystem = document.querySelector<HTMLDivElement>('.solar-system');
  if (!solarSystem) {
    console.error('Solar System: required .solar-system element not found in DOM.');
    return;
  }

  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.classList.add('sr-only');
  liveRegion.id = 'rotation-announcer';
  solarSystem.appendChild(liveRegion);

  const scalingFactor = calculateScalingFactor();
  const infoPanel = createInfoPanel();
  document.body.appendChild(infoPanel);

  updateResponsiveProperties();
  createSun(solarSystem);

  // Kuiper Belt hint
  const kuiperBelt = document.createElement('div');
  kuiperBelt.classList.add('kuiper-belt');
  solarSystem.appendChild(kuiperBelt);

  planets.forEach((planet) => {
    createOrbitPath(planet, solarSystem);
    const planetEl = createPlanet(planet, solarSystem);
    positionElement(planet, planetEl, scalingFactor);
    rotateElement(planetEl);
    createMoons(planet, planetEl, scalingFactor);
    if (planet.name === 'saturn') {
      const ring = document.createElement('div');
      ring.classList.add('saturn-ring');
      planetEl.appendChild(ring);
    }
    planetEl.addEventListener('click', () => {
      showInfoPanel(infoPanel, planet);
    });
    planetEl.addEventListener('dblclick', () => {
      zoomToElement(solarSystem, planetEl);
    });
    domCache.planets.push(planetEl);
  });

  initViewport(solarSystem);
  initTour(solarSystem, planets, infoPanel);

  const controlBar = createControlBar();

  const resetBtn = document.createElement('button');
  resetBtn.classList.add('control-btn', 'control-btn--icon', 'control-btn--reset');
  resetBtn.textContent = '\u21BA'; // reset icon
  resetBtn.setAttribute('aria-label', 'Reset view');
  resetBtn.addEventListener('click', () => resetViewport(solarSystem));
  controlBar.insertBefore(resetBtn, controlBar.firstChild);

  const scaleBtn = document.createElement('button');
  scaleBtn.classList.add('control-btn', 'control-btn--scale');
  scaleBtn.textContent = 'Log';
  scaleBtn.setAttribute('aria-label', 'Toggle logarithmic scale');
  scaleBtn.addEventListener('click', () => {
    const mode = toggleScaleMode(planets);
    scaleBtn.textContent = mode === 'stylized' ? 'Log' : 'Art';
    scaleBtn.setAttribute(
      'aria-label',
      mode === 'stylized' ? 'Toggle logarithmic scale' : 'Toggle stylized scale',
    );
  });
  controlBar.appendChild(scaleBtn);

  // Theme toggle
  const themeBtn = document.createElement('button');
  themeBtn.classList.add('control-btn', 'control-btn--theme');
  themeBtn.textContent = getSettings().theme === 'dark' ? 'Navy' : 'Black';
  themeBtn.setAttribute('aria-label', 'Toggle theme');
  themeBtn.addEventListener('click', () => {
    const newTheme = getSettings().theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    themeBtn.textContent = newTheme === 'dark' ? 'Navy' : 'Black';
  });
  controlBar.appendChild(themeBtn);

  // Labels toggle
  const labelBtn = document.createElement('button');
  labelBtn.classList.add('control-btn', 'control-btn--labels');
  labelBtn.textContent = 'Labels';
  labelBtn.setAttribute('aria-label', 'Toggle always-on labels');
  let labelsOn = getSettings().labelsAlwaysOn;
  if (labelsOn) labelBtn.classList.add('control-btn--active');
  labelBtn.addEventListener('click', () => {
    labelsOn = !labelsOn;
    toggleLabels(labelsOn);
    labelBtn.classList.toggle('control-btn--active', labelsOn);
  });
  controlBar.appendChild(labelBtn);

  const sep2 = document.createElement('div');
  sep2.classList.add('control-separator');
  controlBar.appendChild(sep2);

  const tourBtn = document.createElement('button');
  tourBtn.classList.add('control-btn', 'control-btn--tour');
  tourBtn.textContent = 'Tour';
  tourBtn.setAttribute('aria-label', 'Start guided tour');
  tourBtn.addEventListener('click', startTour);
  controlBar.appendChild(tourBtn);

  document.body.appendChild(controlBar);
  initKeyboardShortcuts();

  const starCount = window.innerWidth <= 768 ? 50 : 100;
  initStarfield(solarSystem, starCount);
  initAsteroidBelt(solarSystem, window.innerWidth <= 768 ? 150 : 300);
  initComets(solarSystem);
  applyScalingAndReposition(planets, scalingFactor);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) {
    pauseStarfield();
    pauseAsteroids();
    pauseComets();
  }
  reducedMotion.addEventListener('change', (e) => {
    if (e.matches) {
      pauseStarfield();
      pauseAsteroids();
      pauseComets();
    } else {
      resumeStarfield();
      resumeAsteroids();
      resumeComets();
    }
  });

  const mediaQueries = [
    window.matchMedia('(max-width: 480px)'),
    window.matchMedia('(max-width: 768px)'),
    window.matchMedia('(max-width: 1024px)'),
  ];

  function handleViewportChange() {
    updateResponsiveProperties();
    const resizeScalingFactor = calculateScalingFactor();
    applyScalingAndReposition(planets, resizeScalingFactor);
    if (getScale() === 1) {
      scheduleCheck(planets, resizeScalingFactor);
    }
    handleStarfieldResize();
    handleAsteroidResize();
    handleCometResize();
  }

  mediaQueries.forEach((mq) => mq.addEventListener('change', handleViewportChange));

  // Still need resize for continuous scaling (not just breakpoint changes)
  window.addEventListener('resize', throttle(handleViewportChange, 200));

  initPerformanceMonitoring();
  initRouter(solarSystem, planets, infoPanel);
});

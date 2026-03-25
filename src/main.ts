import './styles.css';
import { getPlanetData } from './data.ts';
import { createSun, createPlanet, createMoons, createOrbitPath } from './dom.ts';
import { createInfoPanel, showInfoPanel } from './panel.ts';
import { initStarfield, handleStarfieldResize, pauseStarfield, resumeStarfield } from './stars.ts';
import { initAsteroidBelt, handleAsteroidResize, pauseAsteroids, resumeAsteroids } from './asteroids.ts';
import { initComets, handleCometResize, pauseComets, resumeComets } from './comets.ts';
import { toggleAmbientAudio, playPlanetTone, getStoredAudioPreference } from './audio.ts';
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

document.addEventListener('DOMContentLoaded', function () {
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
  solarSystem.appendChild(infoPanel);

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
      playPlanetTone(planet.sizeRatio, planet.distance);
    });
    planetEl.addEventListener('dblclick', () => {
      zoomToElement(solarSystem, planetEl);
    });
    domCache.planets.push(planetEl);
  });

  initViewport(solarSystem);

  const controlBar = createControlBar();

  const resetBtn = document.createElement('button');
  resetBtn.classList.add('control-btn', 'control-btn--reset');
  resetBtn.textContent = '\u21BA'; // reset icon
  resetBtn.setAttribute('aria-label', 'Reset view');
  resetBtn.addEventListener('click', () => resetViewport(solarSystem));
  controlBar.insertBefore(resetBtn, controlBar.firstChild);

  const audioBtn = document.createElement('button');
  audioBtn.classList.add('control-btn', 'control-btn--audio');
  audioBtn.textContent = 'Sound';
  audioBtn.setAttribute('aria-label', 'Enable ambient audio');
  // Reflect stored preference in button state (but do NOT auto-play — browsers block it)
  if (getStoredAudioPreference()) {
    audioBtn.classList.add('control-btn--active');
    audioBtn.setAttribute('aria-label', 'Disable ambient audio');
  }
  audioBtn.addEventListener('click', () => {
    const enabled = toggleAmbientAudio();
    audioBtn.classList.toggle('control-btn--active', enabled);
    audioBtn.setAttribute('aria-label', enabled ? 'Disable ambient audio' : 'Enable ambient audio');
  });
  controlBar.appendChild(audioBtn);

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
});

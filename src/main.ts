import './styles.css';
import { getPlanetData } from './data.ts';
import { createSun, createPlanet, createMoons, createOrbitPath } from './dom.ts';
import { createInfoPanel, showInfoPanel } from './panel.ts';
import { spawnStars } from './stars.ts';
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
    domCache.planets.push(planetEl);
  });

  const starCount = window.innerWidth <= 768 ? 50 : 100;
  const stars = spawnStars(solarSystem, starCount);
  applyScalingAndReposition(planets, stars, scalingFactor);

  const mediaQueries = [
    window.matchMedia('(max-width: 480px)'),
    window.matchMedia('(max-width: 768px)'),
    window.matchMedia('(max-width: 1024px)'),
  ];

  function handleViewportChange() {
    updateResponsiveProperties();
    const resizeScalingFactor = calculateScalingFactor();
    applyScalingAndReposition(planets, stars, resizeScalingFactor);
    scheduleCheck(planets, stars, resizeScalingFactor);
  }

  mediaQueries.forEach((mq) => mq.addEventListener('change', handleViewportChange));

  // Still need resize for continuous scaling (not just breakpoint changes)
  window.addEventListener('resize', throttle(handleViewportChange, 200));
});

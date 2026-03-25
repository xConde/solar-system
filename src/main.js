import './styles.css';
import { getPlanetData } from './data.js';
import { createSun, createPlanet, createMoons } from './dom.js';
import { spawnStars } from './stars.js';
import {
  updateResponsiveProperties,
  calculateScalingFactor,
  positionElement,
  rotateElement,
  applyScalingAndReposition,
  scheduleCheck,
  throttle,
} from './scaling.js';
import { domCache } from './state.js';

document.addEventListener('DOMContentLoaded', function () {
  const planets = getPlanetData();
  const solarSystem = document.querySelector('.solar-system');
  if (!solarSystem) {
    console.error('Solar System: required .solar-system element not found in DOM.');
    return;
  }
  const scalingFactor = calculateScalingFactor();

  updateResponsiveProperties();
  createSun(solarSystem);
  planets.forEach(planet => {
    const planetEl = createPlanet(planet, solarSystem);
    positionElement(planet, planetEl, scalingFactor);
    rotateElement(planetEl);
    createMoons(planet, planetEl, scalingFactor);
    if (planet.name === 'saturn') {
      const ring = document.createElement('div');
      ring.classList.add('saturn-ring');
      planetEl.appendChild(ring);
    }
    domCache.planets.push(planetEl);
  });

  const stars = spawnStars(solarSystem, 100);
  applyScalingAndReposition(planets, stars, scalingFactor);

  window.addEventListener('resize',
  throttle(() => {
    updateResponsiveProperties();
    const resizeScalingFactor = calculateScalingFactor();
    applyScalingAndReposition(planets, stars, resizeScalingFactor);
    scheduleCheck(planets, stars, resizeScalingFactor);
  }, 200));
});

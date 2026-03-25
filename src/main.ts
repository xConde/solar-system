import './styles.css';
import { getPlanetData } from './data.ts';
import { createSun, createPlanet, createMoons } from './dom.ts';
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

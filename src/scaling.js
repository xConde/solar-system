import { domCache, checkScheduled, setCheckScheduled } from './state.js';

export function updateResponsiveProperties() {
  const width = window.innerWidth;
  let earthSize, sunSize;

  if (width <= 480) {
    earthSize = 0.75;
    sunSize = 4;
  } else if (width <= 768) {
    earthSize = 1.5;
    sunSize = 6;
  } else if (width <= 1024) {
    earthSize = 2;
    sunSize = 8;
  } else {
    earthSize = 2.3625;
    sunSize = 10;
  }

  const moonSize = earthSize * 0.285;

  document.documentElement.style.setProperty('--earth-size', earthSize + 'rem');
  document.documentElement.style.setProperty('--luna-moon-size', moonSize + 'rem');
  document.documentElement.style.setProperty('--sun-size', sunSize + 'rem');
}

export function getSunRadius() {
  const sunSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sun-size'));
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return (sunSize * fontSize) / 2;
}

export function positionStar(star) {
  const safeZoneMargin = 1.15;
  const sunRadiusX = (getSunRadius() / window.innerWidth) * 100 * safeZoneMargin;
  const sunRadiusY = (getSunRadius() / window.innerHeight) * 100 * safeZoneMargin;
  let x, y;
  let iterations = 0;
  const MAX_ITERATIONS = 100;
  do {
    x = Math.random() * 100;
    y = Math.random() * 100;
    iterations++;
  } while (
    Math.sqrt(Math.pow((50 - x) / sunRadiusX, 2) + Math.pow((50 - y) / sunRadiusY, 2)) < 1 &&
    iterations < MAX_ITERATIONS
  );

  star.style.left = `${x}vw`;
  star.style.top = `${y}vh`;
}

export function calculateScalingFactor() {
  const minDimension = Math.min(window.innerWidth, window.innerHeight);
  return minDimension / 150;
}

export function calculateApproximateDistance(planet, scalingFactor) {
  const scaledDistance = planet.distance * scalingFactor;
  const angle = planet.initialAngle;
  const x = scaledDistance * Math.cos(angle);
  const y = scaledDistance * Math.sin(angle);

  return { x, y };
}

export function rotateElement(element) {
  const randomRotation = Math.random() * 360;
  element.style.setProperty('--rotation', randomRotation + 'deg');
}

export function positionElement(object, element, newScalingFactor, scaleFactor = 1) {
  const { x, y } = calculateApproximateDistance(object, newScalingFactor);
  element.style.transform = `translate(${x}em, ${y}em) scale(${scaleFactor})`;
}

export function applyScalingAndReposition(planets, stars, scaleFactor, positionFactor = 1) {
  const newScalingFactor = calculateScalingFactor() * positionFactor;
  const speedFactor = 500;

  planets.forEach((planet, index) => {
    const planetEl = domCache.planets[index];
    positionElement(planet, planetEl, newScalingFactor, scaleFactor);

    const adjustedOrbitalPeriod = planet.orbitalPeriod / speedFactor * newScalingFactor;
    planetEl.style.animationDuration = `${adjustedOrbitalPeriod}s`;

    planet.moons.forEach(moon => {
      const moonEl = domCache.moons[moon.name];
      if (!moonEl) {
        console.warn(`Solar System: no cached DOM element for moon "${moon.name}"; skipping reposition.`);
        return;
      }
      positionElement(moon, moonEl, newScalingFactor * 2, scaleFactor);
    });
  });

  stars.forEach(star => positionStar(star));
}

export function throttle(func, wait) {
  let lastCallTime;
  let timeout;

  return function () {
    const now = new Date().getTime();
    const timeSinceLastCall = now - (lastCallTime || 0);

    const context = this;
    const args = arguments;

    const later = () => {
      lastCallTime = now;
      timeout = null;
      func.apply(context, args);
    };

    if (!timeout) {
      if (timeSinceLastCall >= wait) {
        later();
      } else {
        timeout = setTimeout(later, wait - timeSinceLastCall);
      }
    }
  };
}

export function planetsOffScreen(planets) {
  const offScreenPlanets = [];

  planets.forEach(planet => {
    const rect = planet.getBoundingClientRect();
    if (
      rect.right < 0 ||
      rect.left > window.innerWidth ||
      rect.bottom < 0 ||
      rect.top > window.innerHeight
    ) {
      offScreenPlanets.push(planet);
    }
  });

  return offScreenPlanets;
}

export function checkPlanetsOffScreen(planets, stars, scalingFactor, maxAttempts = 5) {
  if (maxAttempts <= 0) return;

  const offScreenPlanets = planetsOffScreen(domCache.planets);

  if (offScreenPlanets.length > 0) {
    const positionFactor = 0.85;
    const scaleFactor = 0.9;
    applyScalingAndReposition(planets, stars, scaleFactor, positionFactor);
    checkPlanetsOffScreen(planets, stars, scalingFactor, maxAttempts - 1);
  }
}

export function scheduleCheck(planets, stars, scalingFactor) {
  if (!checkScheduled) {
    setCheckScheduled(true);
    requestAnimationFrame(() => {
      checkPlanetsOffScreen(planets, stars, scalingFactor);
      setCheckScheduled(false);
    });
  }
}

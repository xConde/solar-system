const domCache = { planets: [], moons: {} };
let checkScheduled = false;

function getPlanetData() {
  return [
    {
      name: 'mercury',
      color: '#c8c8c8',
      sizeRatio: 0.383,
      distance: 0.39,
      orbitalPeriod: 87.97,
      moons: [],
      initialAngle: Math.random() * 2 * Math.PI,
    },
    {
      name: 'venus',
      color: '#f1c40f',
      sizeRatio: 0.949,
      distance: 0.72,
      orbitalPeriod: 224.7,
      moons: [],
      initialAngle: Math.random() * 2 * Math.PI,
    },
    {
      name: 'earth',
      color: '#3498db',
      sizeRatio: 1,
      distance: 1,
      orbitalPeriod: 365.25,
      moons: [
        { name: 'luna', distance: 30, color: '#ccc', sizeRatio: 1 }
      ],
      initialAngle: Math.random() * 2 * Math.PI,
    },
    {
      name: 'mars',
      color: '#e74c3c',
      sizeRatio: 0.57,
      distance: 1.52,
      orbitalPeriod: 687,
      moons: [
        { name: 'phobos', distance: 2.8, color: '#ccc', sizeRatio: 0.5 },
        { name: 'deimos', distance: 7, color: '#ccc', sizeRatio: 0.5 },
      ],
      initialAngle: Math.random() * 2 * Math.PI,
    },
    {
      name: 'jupiter',
      color: '#f1c40f',
      sizeRatio: 2,
      distance: 5.2,
      orbitalPeriod: 4332.59,
      moons: [
        { name: 'io', distance: 5.9, color: '#ccc', sizeRatio: 0.666 },
        { name: 'europa', distance: 9.4, color: '#ccc', sizeRatio: 0.666 },
        { name: 'ganymede', distance: 15, color: '#ccc', sizeRatio: 0.666 },
        { name: 'callisto', distance: 26.3, color: '#ccc', sizeRatio: 0.666 },
      ],
      initialAngle: Math.random() * 2 * Math.PI,
    },
    {
      name: 'saturn',
      color: '#e67e22',
      sizeRatio: 1.714,
      distance: 9.5,
      orbitalPeriod: 10759.22,
      moons: [
        { name: 'titan', distance: 20.6, color: '#ccc', sizeRatio: 1.333 },
      ],
      initialAngle: Math.random() * 2 * Math.PI,
    },
    {
      name: 'uranus',
      color: '#5da6e1',
      sizeRatio: 1.556,
      distance: 19.2,
      orbitalPeriod: 30688.5,
      moons: [
        { name: 'titania', distance: 28.7, color: '#ccc', sizeRatio: 1 },
        { name: 'oberon', distance: 30.4, color: '#ccc', sizeRatio: 1 },
      ],
      initialAngle: Math.random() * 2 * Math.PI,
    },
    {
      name: 'neptune',
      color: '#4a6f8d',
      sizeRatio: 1.556,
      distance: 30.1,
      orbitalPeriod: 60182,
      moons: [
        { name: 'triton', distance: 14.4, color: '#ccc', sizeRatio: 1 },
      ],
      initialAngle: Math.random() * 2 * Math.PI,
    },
  ];
}

function createSun(parentElement) {
  const sunEl = document.createElement('div');
  sunEl.classList.add('sun');
  parentElement.appendChild(sunEl);
}

function updateResponsiveProperties() {
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

function getSunRadius() {
  const sunSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sun-size'));
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return (sunSize * fontSize) / 2;
}

function createPlanet(planet, solarSystem) {
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
  const planetSize = parseFloat(getComputedStyle(planetEl).getPropertyValue(`--${planet.name}-size`));
  const counterSize = Math.max(Math.min(planetSize * 0.2, 16), 12);
  rotationCounterEl.style.fontSize = `${counterSize}px`;
  rotationCounterEl.innerText = '';
  planetEl.appendChild(rotationCounterEl);

  planetEl.addEventListener('click', handlePlanetClick);
  planetEl.addEventListener('animationiteration', () => {
    const currentValue = parseInt(rotationCounterEl.innerText, 10) || 0;
    rotationCounterEl.innerText = currentValue + 1;
  });

  return planetEl;
}

function createMoons(planet, planetEl, scalingFactor) {
  planet.moons.forEach(moon => {
    const moonEl = document.createElement('div');
    moonEl.classList.add('moon', `moon-${moon.name}`);
    planetEl.appendChild(moonEl);
    moonEl.style.setProperty('--distance', moon.distance / (scalingFactor * 2) + 'em');
    moonEl.style.backgroundColor = moon.color;
    moonEl.style.width = `calc(var(--luna-moon-size) * ${moon.sizeRatio})`;
    moonEl.style.height = `calc(var(--luna-moon-size) * ${moon.sizeRatio})`;
    domCache.moons[moon.name] = moonEl;
    moonEl.style.opacity = 1;
  });
  planetEl.style.opacity = 1;
}

function createStar() {
  const star = document.createElement('div');
  star.classList.add('star');

  const size = Math.random() * 2 + 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;

  positionStar(star);

  const duration = Math.random() * 2 + 1;
  star.style.animationDuration = `${duration}s`;

  return star;
}

function positionStar(star) {
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

function spawnStars(parentElement, numberOfStars) {
  const stars = [];
  for (let i = 0; i < numberOfStars; i++) {
    const star = createStar();
    parentElement.appendChild(star);
    stars.push(star);
  }
  return stars;
}

function calculateScalingFactor() {
  const minDimension = Math.min(window.innerWidth, window.innerHeight);
  return minDimension / 150;
}

function calculateApproximateDistance(planet, scalingFactor) {
  const scaledDistance = planet.distance * scalingFactor;
  const angle = planet.initialAngle;
  const x = scaledDistance * Math.cos(angle);
  const y = scaledDistance * Math.sin(angle);

  return { x, y };
}

function rotateElement(element) {
  const randomRotation = Math.random() * 360;
  element.style.setProperty('--rotation', randomRotation + 'deg');
}

function positionElement(object, element, newScalingFactor, scaleFactor = 1) {
  const { x, y } = calculateApproximateDistance(object, newScalingFactor);
  element.style.transform = `translate(${x}em, ${y}em) scale(${scaleFactor})`;
}

function applyScalingAndReposition(planets, stars, scaleFactor, positionFactor = 1) {
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

function throttle(func, wait) {
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

function handlePlanetClick(event) {
  event.currentTarget.classList.toggle('clicked');
}

function checkPlanetsOffScreen(planets, stars, scalingFactor, maxAttempts = 5) {
  if (maxAttempts <= 0) return;

  const offScreenPlanets = planetsOffScreen(domCache.planets);

  if (offScreenPlanets.length > 0) {
    const positionFactor = 0.85;
    const scaleFactor = 0.9;
    applyScalingAndReposition(planets, stars, scaleFactor, positionFactor);
    checkPlanetsOffScreen(planets, stars, scalingFactor, maxAttempts - 1);
  }
}

function scheduleCheck(planets, stars, scalingFactor) {
  if (!checkScheduled) {
    checkScheduled = true;
    requestAnimationFrame(() => {
      checkPlanetsOffScreen(planets, stars, scalingFactor);
      checkScheduled = false;
    });
  }
}

function planetsOffScreen(planets) {
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

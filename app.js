const domCache = { planets: [], moons: {} };
let checkScheduled = false;

function getPlanetData() {
  return [
    {
      name: 'mercury',
      distance: 0.39,
      orbitalPeriod: 87.97,
      moons: [],
    },
    {
      name: 'venus',
      distance: 0.72,
      orbitalPeriod: 224.7,
      moons: [],
    },
    {
      name: 'earth',
      distance: 1,
      orbitalPeriod: 365.25,
      moons: [
        { name: 'luna', distance: 30 }
      ],
    },
    {
      name: 'mars',
      distance: 1.52,
      orbitalPeriod: 687,
      moons: [
        { name: 'phobos', distance: 2.8 },
        { name: 'deimos', distance: 7 },
      ],
    },
    {
      name: 'jupiter',
      distance: 5.2,
      orbitalPeriod: 4332.59,
      moons: [
        { name: 'io', distance: 5.9 },
        { name: 'europa', distance: 9.4 },
        { name: 'ganymede', distance: 15 },
        { name: 'callisto', distance: 26.3 },
      ],
    },
    {
      name: 'saturn',
      distance: 9.5,
      orbitalPeriod: 10759.22,
      moons: [
        { name: 'titan', distance: 20.6 },
      ],
    },
    {
      name: 'uranus',
      distance: 19.2,
      orbitalPeriod: 30688.5,
      moons: [
        { name: 'titania', distance: 28.7 },
        { name: 'oberon', distance: 30.4 },
      ],
    },
    {
      name: 'neptune',
      distance: 30.1,
      orbitalPeriod: 60182,
      moons: [
        { name: 'triton', distance: 14.4 },
      ],
    },
  ];
}

function createSun(parentElement) {
  const sunEl = document.createElement('div');
  sunEl.classList.add('sun');
  parentElement.appendChild(sunEl);
}

function getSunRadius() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const minScreenSize = Math.min(screenWidth, screenHeight);

  if (screenWidth <= 480) {
    return minScreenSize * 0.04; // 4rem
  } else if (screenWidth <= 768) {
    return minScreenSize * 0.03; // 6rem
  } else if (screenWidth <= 1024) {
    return minScreenSize * 0.02; // 8rem
  } else {
    return minScreenSize * 0.025; // 10rem
  }
}

function createPlanet(planet, parentElement) {
  const planetEl = document.createElement('div');
  planetEl.classList.add('planet', planet.name);
  parentElement.appendChild(planetEl);

  const label = document.createElement('div');
  label.classList.add('planet-label');
  label.innerText = planet.name;
  planetEl.appendChild(label);

  return planetEl;
}

function createMoons(planet, planetEl, scalingFactor) {
  planet.moons.forEach(moon => {
    const moonEl = document.createElement('div');
    moonEl.classList.add('moon', `moon-${moon.name}`);
    planetEl.appendChild(moonEl);
    moonEl.style.setProperty('--distance', moon.distance / (scalingFactor * 2) + 'em');
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
  const safeZoneRadius = getSunRadius() * safeZoneMargin;
  let x, y;
  do {
    x = Math.random() * 100;
    y = Math.random() * 100;
  } while (Math.sqrt(Math.pow(50 - x, 2) + Math.pow(50 - y, 2)) < safeZoneRadius);

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
  const angle = Math.random() * 2 * Math.PI;
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

function applyScalingAndReposition(planets, stars, scaleFactor) {
  const newScalingFactor = calculateScalingFactor();

  planets.forEach((planet, index) => {
    const planetEl = domCache.planets[index];
    positionElement(planet, planetEl, newScalingFactor, scaleFactor);

    const speedFactor = 500;
    const adjustedOrbitalPeriod = planet.orbitalPeriod / speedFactor * newScalingFactor;
    planetEl.style.animationDuration = `${adjustedOrbitalPeriod}s`;

    planet.moons.forEach(moon => {
      const moonEl = domCache.moons[moon.name];
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
  event.target.classList.toggle('clicked');
}

function checkPlanetsOffScreen(planets, stars, scalingFactor) {
  const offScreenPlanets = planetsOffScreen(domCache.planets);

  if (offScreenPlanets.length > 0) {
    const positionFactor = 0.85;
    const scaleFactor = 0.9;
    applyScalingAndReposition(planets, stars, scaleFactor, positionFactor);
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
  const scalingFactor = calculateScalingFactor();

  createSun(solarSystem);
  planets.forEach(planet => {
    const planetEl = createPlanet(planet, solarSystem);
    positionElement(planet, planetEl, scalingFactor);
    rotateElement(planetEl);
    createMoons(planet, planetEl, scalingFactor);
    domCache.planets.push(planetEl);
  });

  const stars = spawnStars(solarSystem, 100);
  applyScalingAndReposition(planets, stars, scalingFactor);

  window.addEventListener('resize',
  throttle(() => {
    const resizeScalingFactor = calculateScalingFactor();
    applyScalingAndReposition(planets, stars, resizeScalingFactor);
    scheduleCheck(planets, stars, resizeScalingFactor);
  }, 200));
  domCache.planets.forEach(planetEl => {
    planetEl.addEventListener('click', handlePlanetClick);
    planetEl.addEventListener('orbitCompleted', throttle(() => {
      scheduleCheck(planets, stars, scalingFactor);
    }, 200));
  });
});

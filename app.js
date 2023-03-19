document.addEventListener('DOMContentLoaded', function () {
  const planets = getPlanetData();
  const solarSystem = document.querySelector('.solar-system');
  createSun(solarSystem);
  const scalingFactor = calculateScalingFactor();

  planets.forEach(planet => {
    const planetEl = createPlanetElement(planet, solarSystem);
    positionPlanet(planet, planetEl, scalingFactor);
    createMoons(planet, planetEl, scalingFactor);
  });

  updateScalingFactor(planets, scalingFactor);

  window.addEventListener('resize', () => updateScalingFactor(planets, scalingFactor));
});

function getPlanetData() {
  return [
    {
      name: 'earth',
      distance: 1,
      orbitalPeriod: 365.25,
      moons: [
        { name: 'earth', distance: 30 }
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

function createPlanetElement(planet, parentElement) {
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
    moonEl.style.opacity = 1;
  });
  planetEl.style.opacity = 1;
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

function positionPlanet(planet, planetEl, scalingFactor) {
  const { x, y } = calculateApproximateDistance(planet, scalingFactor);
  planetEl.style.transform = `translate(${x}em, ${y}em)`;

  const randomRotation = Math.random() * 360;
  planetEl.style.setProperty('--rotation', randomRotation + 'deg');
}

function updateScalingFactor(planets, scalingFactor) {
  const newScalingFactor = calculateScalingFactor();
  planets.forEach(planet => {
    const planetEl = document.querySelector(`.planet.${planet.name}`);
    const { x, y } = calculateApproximateDistance(planet, newScalingFactor);
    planetEl.style.transform = `translate(${x}em, ${y}em)`;

    const speedFactor = 100;
    const adjustedOrbitalPeriod = planet.orbitalPeriod / speedFactor * newScalingFactor;
    planetEl.style.animationDuration = `${adjustedOrbitalPeriod}s`;

    planet.moons.forEach(moon => {
      const moonEl = document.querySelector(`.moon.moon-${moon.name}`);
      moonEl.style.setProperty('--distance', moon.distance / (newScalingFactor * 2) + 'em');
    });
  });
}

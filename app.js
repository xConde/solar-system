document.addEventListener('DOMContentLoaded', function () {
  const planets = [
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

  function getRandomRotation() {
    return Math.random() * 360;
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

  function updateScalingFactor() {
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

  const solarSystem = document.querySelector('.solar-system');
  const sunEl = document.createElement('div');
  sunEl.classList.add('sun');
  solarSystem.appendChild(sunEl);

  const scalingFactor = calculateScalingFactor();

  planets.forEach(planet => {
    const planetEl = document.createElement('div');
    planetEl.classList.add('planet', planet.name);
    solarSystem.appendChild(planetEl);

    const label = document.createElement('div');
    label.classList.add('planet-label');
    label.innerText = planet.name;
    planetEl.appendChild(label);

    const { x, y } = calculateApproximateDistance(planet, scalingFactor);
    planetEl.style.transform = `translate(${x}em, ${y}em)`;
    
    const randomRotation = getRandomRotation();
    planetEl.style.setProperty('--rotation', randomRotation + 'deg');

    planet.moons.forEach(moon => {
      const moonEl = document.createElement('div');
      moonEl.classList.add('moon', `moon-${moon.name}`);
      moonEl.style.setProperty('--distance', moon.distance / (scalingFactor * 2) + 'em');
      planetEl.appendChild(moonEl);
      moonEl.style.opacity = 1;
    });

    planetEl.style.opacity = 1;

    const speedFactor = 50;
    planetEl.style.animationDuration = `${planet.orbitalPeriod / speedFactor}s`;
  });

  updateScalingFactor();

  window.addEventListener('resize', () => {
    updateScalingFactor();
  });
});

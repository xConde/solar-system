export function getPlanetData() {
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

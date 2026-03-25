import { describe, it, expect } from 'vitest';
import { getPlanetData } from './data.ts';

describe('getPlanetData', () => {
  const planets = getPlanetData();

  it('returns all planets and dwarf planets', () => {
    expect(planets.length).toBe(10); // 8 planets + ceres + pluto
  });

  it('each planet has required properties', () => {
    planets.forEach(planet => {
      expect(planet.name).toBeTruthy();
      expect(typeof planet.distance).toBe('number');
      expect(typeof planet.orbitalPeriod).toBe('number');
      expect(typeof planet.sizeRatio).toBe('number');
      expect(planet.color).toMatch(/^#[0-9a-fA-F]{3,8}$/);
      expect(Array.isArray(planet.moons)).toBe(true);
      expect(typeof planet.initialAngle).toBe('number');
      expect(planet.type).toMatch(/^(planet|dwarf-planet)$/);
    });
  });

  it('planets are ordered by distance from sun', () => {
    for (let i = 1; i < planets.length; i++) {
      expect(planets[i].distance).toBeGreaterThan(planets[i - 1].distance);
    }
  });

  it('all moons have required properties', () => {
    planets.forEach(planet => {
      planet.moons.forEach(moon => {
        expect(moon.name).toBeTruthy();
        expect(typeof moon.distance).toBe('number');
        expect(typeof moon.sizeRatio).toBe('number');
        expect(moon.color).toMatch(/^#[0-9a-fA-F]{3,8}$/);
      });
    });
  });

  it('each planet has info data', () => {
    planets.forEach(planet => {
      expect(planet.info).toBeDefined();
      expect(planet.info!.diameter).toBeTruthy();
      expect(planet.info!.distanceFromSun).toBeTruthy();
      expect(planet.info!.orbitalPeriod).toBeTruthy();
      expect(typeof planet.info!.numberOfMoons).toBe('number');
      expect(planet.info!.funFact).toBeTruthy();
    });
  });

  it('has exactly 8 regular planets', () => {
    const regularPlanets = planets.filter(p => p.type === 'planet');
    expect(regularPlanets.length).toBe(8);
  });

  it('has dwarf planets', () => {
    const dwarfPlanets = planets.filter(p => p.type === 'dwarf-planet');
    expect(dwarfPlanets.length).toBeGreaterThan(0);
    expect(dwarfPlanets.map(p => p.name)).toContain('pluto');
    expect(dwarfPlanets.map(p => p.name)).toContain('ceres');
  });
});

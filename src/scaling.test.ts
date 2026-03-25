import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateScalingFactor, calculateApproximateDistance } from './scaling.ts';
import type { Planet } from './types.ts';

describe('calculateScalingFactor', () => {
  beforeEach(() => {
    vi.stubGlobal('innerWidth', 1920);
    vi.stubGlobal('innerHeight', 1080);
  });

  it('returns min dimension divided by 150', () => {
    expect(calculateScalingFactor()).toBe(1080 / 150);
  });

  it('uses width when it is smaller', () => {
    vi.stubGlobal('innerWidth', 800);
    vi.stubGlobal('innerHeight', 1200);
    expect(calculateScalingFactor()).toBe(800 / 150);
  });
});

describe('calculateApproximateDistance', () => {
  it('returns position based on planet distance and angle', () => {
    const planet: Planet = {
      name: 'test',
      distance: 1,
      orbitalPeriod: 365,
      moons: [],
      initialAngle: 0,
      color: '#fff',
      sizeRatio: 1,
      type: 'planet',
    };

    const result = calculateApproximateDistance(planet, 10);
    expect(result.x).toBeCloseTo(10); // cos(0) = 1, so 1 * 10
    expect(result.y).toBeCloseTo(0); // sin(0) = 0
  });

  it('positions correctly at PI/2', () => {
    const planet: Planet = {
      name: 'test',
      distance: 2,
      orbitalPeriod: 365,
      moons: [],
      initialAngle: Math.PI / 2,
      color: '#fff',
      sizeRatio: 1,
      type: 'planet',
    };

    const result = calculateApproximateDistance(planet, 5);
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(10);
  });
});

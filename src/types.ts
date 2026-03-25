export interface Moon {
  name: string;
  distance: number;
  color: string;
  sizeRatio: number;
  initialAngle?: number;
}

export interface PlanetInfo {
  diameter: string;
  distanceFromSun: string;
  orbitalPeriod: string;
  numberOfMoons: number;
  funFact: string;
}

export interface Planet {
  name: string;
  color: string;
  sizeRatio: number;
  distance: number;
  orbitalPeriod: number;
  type: 'planet' | 'dwarf-planet';
  moons: Moon[];
  initialAngle: number;
  info?: PlanetInfo;
}

export interface DomCache {
  planets: HTMLDivElement[];
  moons: Record<string, HTMLDivElement>;
}

export interface Position {
  x: number;
  y: number;
}

export interface Moon {
  name: string;
  distance: number;
  color: string;
  sizeRatio: number;
  initialAngle?: number;
}

export interface Planet {
  name: string;
  color: string;
  sizeRatio: number;
  distance: number;
  orbitalPeriod: number;
  moons: Moon[];
  initialAngle: number;
}

export interface DomCache {
  planets: HTMLDivElement[];
  moons: Record<string, HTMLDivElement>;
}

export interface Position {
  x: number;
  y: number;
}

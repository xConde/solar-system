import type { DomCache } from './types.ts';

export const domCache: DomCache = { planets: [], moons: {} };
export let checkScheduled: boolean = false;
export function setCheckScheduled(value: boolean): void { checkScheduled = value; }

import { describe, it, expect } from 'vitest';
import { domCache, checkScheduled, setCheckScheduled } from './state.ts';

describe('state', () => {
  it('domCache starts with empty planets array', () => {
    expect(domCache.planets).toEqual([]);
  });

  it('domCache starts with empty moons object', () => {
    expect(domCache.moons).toEqual({});
  });

  it('checkScheduled starts as false', () => {
    expect(checkScheduled).toBe(false);
  });

  it('setCheckScheduled updates the value', () => {
    setCheckScheduled(true);
    // We need to re-import to get the updated value
    // Actually with ES module live bindings, the import reflects the current value
    expect(checkScheduled).toBe(true);
    setCheckScheduled(false); // reset
  });
});

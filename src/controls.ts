import { domCache } from './state.ts';

let currentPlaybackRate = 1;
let isPaused = false;

function getOrbitalAnimations(): Animation[] {
  const animations: Animation[] = [];
  domCache.planets.forEach((planet) => {
    planet.getAnimations().forEach((anim) => animations.push(anim));
    // Get moon animations too
    planet.querySelectorAll('.moon').forEach((moon) => {
      moon.getAnimations().forEach((anim) => animations.push(anim));
    });
  });
  return animations;
}

export function setPlaybackRate(rate: number): void {
  currentPlaybackRate = rate;
  if (!isPaused) {
    getOrbitalAnimations().forEach((anim) => {
      anim.playbackRate = rate;
    });
  }
}

export function togglePause(): boolean {
  isPaused = !isPaused;
  const animations = getOrbitalAnimations();

  if (isPaused) {
    animations.forEach((anim) => anim.pause());
  } else {
    animations.forEach((anim) => {
      anim.playbackRate = currentPlaybackRate;
      anim.play();
    });
  }
  return isPaused;
}

export function getPlaybackRate(): number {
  return currentPlaybackRate;
}

export function getIsPaused(): boolean {
  return isPaused;
}

export function createControlBar(): HTMLDivElement {
  const bar = document.createElement('div');
  bar.classList.add('control-bar');
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', 'Animation controls');

  // Play/Pause button
  const playPauseBtn = document.createElement('button');
  playPauseBtn.classList.add('control-btn', 'control-btn--icon', 'control-btn--play');
  playPauseBtn.setAttribute('aria-label', 'Pause animation');
  playPauseBtn.textContent = '\u23F8'; // pause icon
  playPauseBtn.addEventListener('click', () => {
    const paused = togglePause();
    playPauseBtn.textContent = paused ? '\u25B6' : '\u23F8';
    playPauseBtn.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
  });
  bar.appendChild(playPauseBtn);

  // Speed label
  const speedLabel = document.createElement('span');
  speedLabel.classList.add('control-speed-label');
  speedLabel.textContent = '1x';
  speedLabel.setAttribute('aria-live', 'polite');

  // Speed slider
  const speedSlider = document.createElement('input');
  speedSlider.type = 'range';
  speedSlider.min = '0.1';
  speedSlider.max = '5';
  speedSlider.step = '0.1';
  speedSlider.value = '1';
  speedSlider.classList.add('control-slider');
  speedSlider.setAttribute('aria-label', 'Animation speed');

  speedSlider.addEventListener('input', () => {
    const rate = parseFloat(speedSlider.value);
    setPlaybackRate(rate);
    speedLabel.textContent = `${rate.toFixed(1)}x`;
  });
  bar.appendChild(speedSlider);
  bar.appendChild(speedLabel);

  return bar;
}

// Keyboard shortcuts
export function initKeyboardShortcuts(): void {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    // Don't trigger when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        {
          const btn = document.querySelector('.control-btn--play') as HTMLButtonElement | null;
          if (btn) btn.click();
        }
        break;
      case '+':
      case '=':
        setPlaybackRate(Math.min(currentPlaybackRate + 0.5, 5));
        updateSliderDisplay();
        break;
      case '-':
        setPlaybackRate(Math.max(currentPlaybackRate - 0.5, 0.1));
        updateSliderDisplay();
        break;
    }
  });
}

function updateSliderDisplay(): void {
  const slider = document.querySelector('.control-slider') as HTMLInputElement | null;
  const label = document.querySelector('.control-speed-label') as HTMLSpanElement | null;
  if (slider) slider.value = String(currentPlaybackRate);
  if (label) label.textContent = `${currentPlaybackRate.toFixed(1)}x`;
}

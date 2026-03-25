let audioContext: AudioContext | null = null;
let isAudioEnabled = false;
let ambientOscillator: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

function ensureAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function toggleAmbientAudio(): boolean {
  isAudioEnabled = !isAudioEnabled;

  if (isAudioEnabled) {
    startAmbient();
  } else {
    stopAmbient();
  }

  localStorage.setItem('solar-system-audio', isAudioEnabled ? 'on' : 'off');
  return isAudioEnabled;
}

function startAmbient(): void {
  const ctx = ensureAudioContext();
  if (ctx.state === 'suspended') ctx.resume();

  // Create a deep space drone using multiple oscillators
  ambientGain = ctx.createGain();
  ambientGain.gain.value = 0;
  ambientGain.connect(ctx.destination);

  // Fade in
  ambientGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2);

  // Base drone
  ambientOscillator = ctx.createOscillator();
  ambientOscillator.type = 'sine';
  ambientOscillator.frequency.value = 55; // Low A
  ambientOscillator.connect(ambientGain);
  ambientOscillator.start();

  // Add subtle modulation
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.1;
  lfoGain.gain.value = 5;
  lfo.connect(lfoGain);
  lfoGain.connect(ambientOscillator.frequency);
  lfo.start();
}

function stopAmbient(): void {
  if (ambientGain && audioContext) {
    ambientGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
    setTimeout(() => {
      ambientOscillator?.stop();
      ambientOscillator = null;
      ambientGain = null;
    }, 1100);
  }
}

export function playPlanetTone(sizeRatio: number, distance: number): void {
  if (!isAudioEnabled) return;
  const ctx = ensureAudioContext();

  // Map planet size to frequency (larger = lower)
  const freq = 220 / sizeRatio;
  // Map distance to duration
  const duration = 0.2 + distance * 0.05;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.value = 0.05;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function getIsAudioEnabled(): boolean {
  return isAudioEnabled;
}

export function getStoredAudioPreference(): boolean {
  return localStorage.getItem('solar-system-audio') === 'on';
}

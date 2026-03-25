let audioContext: AudioContext | null = null;
let isAudioEnabled = false;
let ambientOscillator: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
// Track the stop-fade timeout so rapid toggles can cancel it
let stopTimeoutId: ReturnType<typeof setTimeout> | null = null;

function ensureAudioContext(): AudioContext | null {
  if (!audioContext) {
    try {
      audioContext = new AudioContext();
    } catch (e) {
      console.warn('Web Audio API unavailable:', e);
      return null;
    }
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

  try {
    localStorage.setItem('solar-system-audio', isAudioEnabled ? 'on' : 'off');
  } catch {
    // Quota exceeded or storage blocked (e.g. Safari private browsing)
  }
  return isAudioEnabled;
}

// Track LFO nodes so stopAmbient can disconnect them
let ambientLfo: OscillatorNode | null = null;
let ambientLfoGain: GainNode | null = null;

function startAmbient(): void {
  // Cancel any pending stop from a rapid toggle
  if (stopTimeoutId !== null) {
    clearTimeout(stopTimeoutId);
    stopTimeoutId = null;
  }

  const ctx = ensureAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();

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
  ambientLfo = ctx.createOscillator();
  ambientLfoGain = ctx.createGain();
  ambientLfo.frequency.value = 0.1;
  ambientLfoGain.gain.value = 5;
  ambientLfo.connect(ambientLfoGain);
  ambientLfoGain.connect(ambientOscillator.frequency);
  ambientLfo.start();
}

function stopAmbient(): void {
  if (ambientGain && audioContext) {
    // Cancel any previously scheduled stop before scheduling a new one
    if (stopTimeoutId !== null) {
      clearTimeout(stopTimeoutId);
      stopTimeoutId = null;
    }
    ambientGain.gain.cancelScheduledValues(audioContext.currentTime);
    ambientGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
    const oscToStop = ambientOscillator;
    const gainToStop = ambientGain;
    const lfoToStop = ambientLfo;
    const lfoGainToStop = ambientLfoGain;
    // Clear references immediately so startAmbient() can create fresh nodes
    ambientOscillator = null;
    ambientGain = null;
    ambientLfo = null;
    ambientLfoGain = null;
    stopTimeoutId = setTimeout(() => {
      stopTimeoutId = null;
      try {
        lfoGainToStop?.disconnect();
        lfoToStop?.stop();
        lfoToStop?.disconnect();
        gainToStop?.disconnect();
        oscToStop?.stop();
        oscToStop?.disconnect();
      } catch {
        // Nodes may already be stopped/disconnected
      }
    }, 1100);
  }
}

export function playPlanetTone(sizeRatio: number, distance: number): void {
  if (!isAudioEnabled) return;
  const ctx = ensureAudioContext();
  if (!ctx) return;

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
  try {
    return localStorage.getItem('solar-system-audio') === 'on';
  } catch {
    return false;
  }
}

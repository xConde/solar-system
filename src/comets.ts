let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let animationId: number | null = null;

interface Comet {
  name: string;
  semiMajorAxis: number; // relative to viewport
  eccentricity: number;
  periodSeconds: number;
  angle: number; // current angle
  tailLength: number;
}

const COMETS: Comet[] = [
  {
    name: 'halley',
    semiMajorAxis: 0.35,
    eccentricity: 0.967,
    periodSeconds: 120, // simulated period
    angle: 0,
    tailLength: 30,
  },
  {
    name: 'hale-bopp',
    semiMajorAxis: 0.4,
    eccentricity: 0.995,
    periodSeconds: 200,
    angle: Math.PI * 0.7,
    tailLength: 40,
  },
];

function resizeCanvas(): void {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const maxDim = 4096;
  canvas.width = Math.min(window.innerWidth * dpr, maxDim * dpr);
  canvas.height = Math.min(window.innerHeight * dpr, maxDim * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  if (ctx) ctx.scale(dpr, dpr);
}

function drawComets(time: number): void {
  if (!ctx || !canvas) return;

  const context = ctx;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const centerX = w / 2;
  const centerY = h / 2;
  const minDim = Math.min(w, h);
  const elapsed = time * 0.001;

  context.clearRect(0, 0, canvas.width, canvas.height);

  COMETS.forEach((comet) => {
    // Kepler-like elliptical orbit (simplified)
    const meanAnomaly = (elapsed / comet.periodSeconds) * Math.PI * 2 + comet.angle;
    // Approximate eccentric anomaly (1 iteration of Kepler's equation)
    const E = meanAnomaly + comet.eccentricity * Math.sin(meanAnomaly);

    // True anomaly
    const trueAnomaly =
      2 *
      Math.atan2(
        Math.sqrt(1 + comet.eccentricity) * Math.sin(E / 2),
        Math.sqrt(1 - comet.eccentricity) * Math.cos(E / 2),
      );

    // Radius (conic section formula)
    // With e close to 1 the denominator (1 + e*cos(ν)) approaches 0 near aphelion
    // (ν≈π), making r blow up. Clamp to 3× the semi-major axis so the comet
    // stays on-screen and no NaN/Infinity propagates into canvas drawing calls.
    const a = comet.semiMajorAxis * minDim;
    const denom = 1 + comet.eccentricity * Math.cos(trueAnomaly);
    const rRaw = denom > 0 ? (a * (1 - comet.eccentricity * comet.eccentricity)) / denom : Infinity;
    const r = Math.min(rRaw, a * 3);

    const x = centerX + r * Math.cos(trueAnomaly);
    const y = centerY + r * Math.sin(trueAnomaly);

    // Tail direction: always points away from the sun (center)
    const tailAngle = Math.atan2(y - centerY, x - centerX);

    // Draw tail as a gradient line pointing away from sun
    const tailEndX = x + Math.cos(tailAngle) * comet.tailLength;
    const tailEndY = y + Math.sin(tailAngle) * comet.tailLength;

    const gradient = context.createLinearGradient(x, y, tailEndX, tailEndY);
    gradient.addColorStop(0, 'rgba(200, 220, 255, 0.8)');
    gradient.addColorStop(0.3, 'rgba(200, 220, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(200, 220, 255, 0)');

    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(tailEndX, tailEndY);
    context.strokeStyle = gradient;
    context.lineWidth = 2;
    context.stroke();

    // Draw comet head
    context.beginPath();
    context.arc(x, y, 2, 0, Math.PI * 2);
    context.fillStyle = 'rgba(220, 235, 255, 0.9)';
    context.fill();
  });

  animationId = requestAnimationFrame(drawComets);
}

export function initComets(parent: HTMLElement): void {
  canvas = document.createElement('canvas');
  canvas.classList.add('comet-canvas');
  parent.appendChild(canvas);

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  resizeCanvas();
  animationId = requestAnimationFrame(drawComets);
}

export function handleCometResize(): void {
  resizeCanvas();
}

export function pauseComets(): void {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

export function resumeComets(): void {
  if (animationId === null) {
    animationId = requestAnimationFrame(drawComets);
  }
}

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let animationId: number | null = null;

interface Asteroid {
  angle: number;
  distance: number; // distance from center in pixels
  size: number;
  speed: number; // radians per second
  opacity: number;
}

let asteroids: Asteroid[] = [];

function generateAsteroids(count: number): Asteroid[] {
  const result: Asteroid[] = [];
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  // Belt between Mars (13rem) and Jupiter (18rem)
  const minDistRem = 14;
  const maxDistRem = 17;
  const minDist = minDistRem * fontSize;
  const maxDist = maxDistRem * fontSize;

  for (let i = 0; i < count; i++) {
    const dist = minDist + Math.random() * (maxDist - minDist);
    result.push({
      angle: Math.random() * Math.PI * 2,
      distance: dist,
      size: 0.2 + Math.random() * 0.8,
      speed: (0.01 + Math.random() * 0.03) * (Math.random() > 0.5 ? 1 : -1),
      opacity: 0.15 + Math.random() * 0.3,
    });
  }
  return result;
}

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

function drawAsteroids(time: number): void {
  if (!ctx || !canvas) return;

  const context = ctx;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const centerX = w / 2;
  const centerY = h / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);

  const elapsed = time * 0.001;

  asteroids.forEach((asteroid) => {
    const currentAngle = asteroid.angle + elapsed * asteroid.speed;
    const radius = asteroid.distance;
    const x = centerX + Math.cos(currentAngle) * radius;
    const y = centerY + Math.sin(currentAngle) * radius;

    context.beginPath();
    context.arc(x, y, asteroid.size, 0, Math.PI * 2);
    context.fillStyle = `rgba(180, 170, 160, ${asteroid.opacity})`;
    context.fill();
  });

  animationId = requestAnimationFrame(drawAsteroids);
}

export function initAsteroidBelt(parent: HTMLElement, count: number = 300): void {
  canvas = document.createElement('canvas');
  canvas.classList.add('asteroid-canvas');
  parent.appendChild(canvas);

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  asteroids = generateAsteroids(Math.min(count, 500));
  resizeCanvas();
  animationId = requestAnimationFrame(drawAsteroids);
}

export function handleAsteroidResize(): void {
  resizeCanvas();
}

export function pauseAsteroids(): void {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

export function resumeAsteroids(): void {
  if (animationId === null) {
    animationId = requestAnimationFrame(drawAsteroids);
  }
}

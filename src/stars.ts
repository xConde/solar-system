import { getSunRadius } from './scaling.ts';

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let stars: Star[] = [];
let animationId: number | null = null;

function generateStars(count: number): Star[] {
  const safeZoneMargin = 2.5;
  const sunRadiusX = (getSunRadius() / window.innerWidth) * safeZoneMargin;
  const sunRadiusY = (getSunRadius() / window.innerHeight) * safeZoneMargin;

  const result: Star[] = [];
  for (let i = 0; i < Math.min(count, 500); i++) {
    let x: number, y: number;
    let iterations = 0;
    do {
      x = Math.random();
      y = Math.random();
      iterations++;
    } while (
      Math.sqrt(Math.pow((0.5 - x) / sunRadiusX, 2) + Math.pow((0.5 - y) / sunRadiusY, 2)) < 1 &&
      iterations < 100
    );

    result.push({
      x,
      y,
      size: Math.random() * 2 + 0.5,
      baseOpacity: 0.5 + Math.random() * 0.5,
      twinkleSpeed: 0.5 + Math.random() * 2,
      twinkleOffset: Math.random() * Math.PI * 2,
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

function drawStars(time: number): void {
  if (!ctx || !canvas) return;

  const context = ctx;
  const w = window.innerWidth;
  const h = window.innerHeight;

  context.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    const twinkle = Math.sin(time * 0.001 * star.twinkleSpeed + star.twinkleOffset);
    const opacity = star.baseOpacity + twinkle * 0.3;

    context.beginPath();
    context.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, opacity))})`;
    context.fill();
  });

  animationId = requestAnimationFrame(drawStars);
}

export function initStarfield(parent: HTMLElement, count: number): void {
  canvas = document.createElement('canvas');
  canvas.classList.add('starfield-canvas');
  parent.appendChild(canvas);

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  stars = generateStars(count);
  resizeCanvas();
  animationId = requestAnimationFrame(drawStars);
}

export function handleStarfieldResize(): void {
  resizeCanvas();
  stars = generateStars(stars.length);
}

export function pauseStarfield(): void {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

export function resumeStarfield(): void {
  if (animationId === null) {
    animationId = requestAnimationFrame(drawStars);
  }
}

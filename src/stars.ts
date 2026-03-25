import { positionStar } from './scaling.ts';

export { positionStar };

export function createStar(): HTMLDivElement {
  const star = document.createElement('div');
  star.classList.add('star');

  const size = Math.random() * 2 + 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;

  positionStar(star);

  const duration = Math.random() * 2 + 1;
  star.style.animationDuration = `${duration}s`;

  return star;
}

export function spawnStars(parentElement: HTMLElement, numberOfStars: number): HTMLDivElement[] {
  const stars: HTMLDivElement[] = [];
  const safeCount = Math.min(numberOfStars, 500);
  for (let i = 0; i < safeCount; i++) {
    const star = createStar();
    parentElement.appendChild(star);
    stars.push(star);
  }
  return stars;
}

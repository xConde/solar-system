import { positionStar } from './scaling.js';

export { positionStar };

export function createStar() {
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

export function spawnStars(parentElement, numberOfStars) {
  const stars = [];
  for (let i = 0; i < numberOfStars; i++) {
    const star = createStar();
    parentElement.appendChild(star);
    stars.push(star);
  }
  return stars;
}

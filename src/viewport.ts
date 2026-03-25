let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

const MIN_SCALE = 0.3;
const MAX_SCALE = 5;

function applyTransform(container: HTMLElement): void {
  container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

export function initViewport(container: HTMLElement): void {
  // Wheel zoom
  container.addEventListener('wheel', (e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * zoomFactor));

    // Zoom toward cursor position
    const rect = container.getBoundingClientRect();
    const cursorX = e.clientX - rect.left - rect.width / 2;
    const cursorY = e.clientY - rect.top - rect.height / 2;

    const scaleChange = newScale / scale;
    translateX = cursorX - scaleChange * (cursorX - translateX);
    translateY = cursorY - scaleChange * (cursorY - translateY);

    scale = newScale;
    applyTransform(container);
  }, { passive: false });

  // Drag pan
  container.addEventListener('pointerdown', (e: PointerEvent) => {
    if (e.button !== 0) return; // left click only
    // Don't start drag if clicking a planet or control
    if ((e.target as HTMLElement).closest('.planet, .control-bar, .info-panel')) return;

    isDragging = true;
    dragStartX = e.clientX - translateX;
    dragStartY = e.clientY - translateY;
    container.style.cursor = 'grabbing';
    container.setPointerCapture(e.pointerId);
  });

  container.addEventListener('pointermove', (e: PointerEvent) => {
    if (!isDragging) return;
    translateX = e.clientX - dragStartX;
    translateY = e.clientY - dragStartY;
    applyTransform(container);
  });

  const stopDrag = (e: PointerEvent) => {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = '';
    container.releasePointerCapture(e.pointerId);
  };
  container.addEventListener('pointerup', stopDrag);
  container.addEventListener('pointercancel', stopDrag);
}

export function resetViewport(container: HTMLElement): void {
  scale = 1;
  translateX = 0;
  translateY = 0;
  applyTransform(container);
}

export function zoomToElement(container: HTMLElement, element: HTMLElement): void {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  // Calculate where the element center is relative to the container center
  const elementCenterX = elementRect.left + elementRect.width / 2 - containerRect.left - containerRect.width / 2;
  const elementCenterY = elementRect.top + elementRect.height / 2 - containerRect.top - containerRect.height / 2;

  scale = 2;
  translateX = -elementCenterX * scale;
  translateY = -elementCenterY * scale;

  container.style.transition = 'transform 0.5s ease';
  applyTransform(container);

  setTimeout(() => {
    container.style.transition = '';
  }, 500);
}

export function getScale(): number {
  return scale;
}

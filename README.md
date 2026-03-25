# Solar System

An interactive solar system visualization built with TypeScript, CSS, and Canvas. Features orbiting planets with moons, dwarf planets, asteroid belt, comets, and a guided tour with real astronomical data.

## Features

- **10 celestial bodies**: 8 planets + Ceres and Pluto (dwarf planets) with accurate relative properties
- **Moons**: 11 moons orbiting their parent planets
- **Asteroid belt**: Canvas-rendered particle field between Mars and Jupiter
- **Comets**: Halley and Hale-Bopp with Kepler-approximated elliptical orbits
- **Canvas starfield**: Performant twinkling stars with safe-zone avoidance
- **Info panel**: Click any planet for real astronomical data (diameter, distance, orbital period, fun facts)
- **Guided tour**: Step-by-step walkthrough of the solar system
- **Time controls**: Play/pause, speed slider (0.1x-5x) using Web Animations API
- **Zoom and pan**: Mouse wheel zoom, click-drag pan, double-click to focus
- **Scale modes**: Toggle between stylized and logarithmic scale
- **Deep links**: Share direct links to specific planets (#earth, #saturn)
- **Keyboard accessible**: Full keyboard navigation, ARIA labels, screen reader support
- **Reduced motion**: Respects prefers-reduced-motion preference
- **PWA**: Installable, works offline via service worker
- **Theme**: Dark/navy toggle

## Tech Stack

- TypeScript (strict mode)
- Vite (build + dev server)
- CSS Layers and Nesting
- Canvas API (stars, asteroids, comets)
- Web Animations API (playback control)
- Vitest (unit tests)
- Playwright (E2E tests)
- ESLint + Prettier
- GitHub Actions CI
- Cloudflare Pages deployment
- PWA with Workbox

## Development

```bash
npm install
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run type-check   # TypeScript validation
npm run lint         # ESLint
npm run format       # Prettier
npm test             # Unit tests (Vitest)
npm run test:e2e     # E2E tests (Playwright)
```

## Project Structure

```
src/
  main.ts          # Application entry point
  data.ts          # Planet/moon data model
  dom.ts           # DOM element creation
  scaling.ts       # Responsive scaling and positioning
  stars.ts         # Canvas starfield
  asteroids.ts     # Canvas asteroid belt
  comets.ts        # Canvas comet system
  panel.ts         # Planet info panel
  controls.ts      # Time controls (play/pause/speed)
  viewport.ts      # Zoom and pan
  tour.ts          # Guided tour
  router.ts        # Hash-based deep linking
  settings.ts      # Theme and preferences
  scale-mode.ts    # Stylized/logarithmic toggle
  performance.ts   # Web Vitals monitoring
  state.ts         # Shared state management
  types.ts         # TypeScript interfaces
  styles.css       # Styles with CSS layers and nesting
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Toggle play/pause |
| + / - | Adjust animation speed |
| Enter / Space (on planet) | Toggle planet info |
| Tab | Navigate between planets |
| Escape | Close info panel |

## Deployment

Built for Cloudflare Pages:

```bash
npm run build   # Output: dist/
```

Build command: `npm run build`
Output directory: `dist`

## License

MIT

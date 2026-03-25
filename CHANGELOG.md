# Changelog

## v2.0.0

Complete rewrite and modernization of the solar system visualization.

### Bug Fixes
- Fix CSS media query ordering (ascending max-width made breakpoints dead code)
- Fix --earth-moon-size typo in 480px breakpoint
- Fix Saturn ring overriding planet hover hitbox pseudo-element
- Fix event.target vs event.currentTarget in planet click handler
- Fix checkPlanetsOffScreen passing extra argument silently dropped
- Fix star safe zone comparing percentage coordinates against pixel values
- Fix planets jumping to random positions on every resize
- Fix duplicate CSS transition declaration on stars

### Architecture
- Unify responsive system under JS-driven CSS custom properties
- Unify positioning system (CSS owns transform, JS sets properties)
- Centralize planet data as single source of truth
- Convert to ES modules with Vite build system
- Convert to TypeScript with strict mode

### Features
- Orbital path visualization (dashed circles)
- Planet info panel with real astronomical data
- Enhanced planet visuals (gradients, atmospheric glow)
- Enhanced sun visuals (radial gradient, corona effect)
- Canvas-based starfield (replaces 100 DOM elements)
- Time controls (play/pause, speed slider, Web Animations API)
- Zoom and pan navigation
- Asteroid belt (canvas particles)
- Dwarf planets (Pluto with Charon, Ceres)
- Kuiper Belt visual hint
- Comet system (Halley, Hale-Bopp with elliptical orbits)
- Guided tour mode
- Deep linking (#planet-name)
- Logarithmic scale toggle
- Dark/light theme
- PWA (offline support, installable)
- Web Vitals performance monitoring

### Infrastructure
- Vite build system
- TypeScript strict mode
- ESLint + Prettier
- Vitest unit tests
- Playwright E2E tests
- GitHub Actions CI
- Cloudflare Pages deployment config
- Content Security Policy headers
- HSTS, Permissions-Policy, and security headers

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support (ARIA labels, live regions)
- Reduced motion support
- Focus-visible outlines
- 44px minimum touch targets

### Security (8 red-team audits)
- Content Security Policy via HTTP headers
- Infinite loop guards
- Null safety throughout
- Canvas dimension caps
- localStorage error handling
- Pointer capture cleanup
- Animation frame leak prevention

### Visual Overhaul (Post-Release)
- Halved sun size and reduced corona glow to prevent inner planet overlap
- Rebalanced all orbit distances for better viewport fit
- Reduced planet sizes on desktop for cleaner proportions
- Changed orbital animation from cubic-bezier "whoosh" to constant-velocity linear
- Hidden rotation counters by default (show on hover/click only)
- Tour properly closes when dismissing info panel (X or Escape)
- Info panel uses visibility:hidden to prevent edge showing when closed
- Removed all audio features (simplified UX)
- Control buttons restyled as comfortable rectangles with visible borders
- Tour button distinguished with sun-color accent
- Star safe zone expanded to clear sun glow area
- Orbit paths changed from dashed to subtle solid lines
- Asteroid belt repositioned to rem-based coordinates matching planet orbits
- Comets rescaled to match planet coordinate system
- Saturn ring given glow for visibility
- Dark theme forced as default (space should be black)
- Mobile control bar wraps and compacts on small screens
- Planet labels auto-capitalize names

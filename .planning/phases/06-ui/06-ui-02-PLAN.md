---
phase: 06-ui
plan: 02
type: implementation
autonomous: true
wave: 1
depends_on: [06-ui-01]
requirements: [UI-04, UI-05]
---

# Phase 6 Plan 02: Educational Overlays

## Objective
Create educational overlays with arrows, circles, and celebration particles.

## Context
- Phase 6-01 COMPLETE
- ui-manager.js with base UI
- Circular timer working
- Language selector functional

## Tasks

### Task 1: Create Arrow Overlay (45° Brush Angle)
type: auto
tdd: false

**behavior:**
Create an SVG arrow overlay that shows the correct 45° brush angle technique.

**implementation:**
```html
<!-- SVG arrow showing 45° angle -->
<svg id="brush-angle-arrow" class="overlay-svg">
  - Arrow at 45° angle
  - Animated pulse effect
  - Positioned relative to mouth/zone
  - Visible during zone states
</svg>
```

**CSS:**
```css
.overlay-svg {
  position: absolute;
  pointer-events: none;
  z-index: 50;
}
@keyframes pulse-arrow {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}
```

**done when:**
- Arrow shows 45° angle
- Animation is smooth
- Positioned correctly

---

### Task 2: Create Circular Motion Indicators
type: auto
tdd: false

**behavior:**
Create SVG circular arrows that show the brushing motion technique.

**implementation:**
```html
<!-- Circular motion indicator -->
<svg id="brushing-motion" class="overlay-svg">
  - Circular arrow rotating clockwise
  - Shows small circles technique
  - Animated rotation
  - Multiple positions for different zones
</svg>
```

**CSS:**
```css
@keyframes rotate-motion {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

**done when:**
- Circular motion indicator shows
- Rotation animation works
- Positioned relative to zone

---

### Task 3: Create Zone Indicator Overlays
type: auto
tdd: false

**behavior:**
Create overlays that highlight the current brushing zone with position indicators.

**implementation:**
- Zone outline/highlight
- Position indicators for each quadrant
- Visual feedback for current zone
- Smooth transitions between zones

**done when:**
- Zone indicators show current position
- Transitions smoothly between zones
- Clear visual feedback

---

### Task 4: Implement Celebration Particles (UI-05)
type: auto
tdd: false

**behavior:**
Create CSS-based confetti and star particles for celebration state.

**implementation:**
```html
<!-- Celebration particles container -->
<div id="celebration-particles">
  - Confetti pieces (multi-colored)
  - Floating stars
  - "¡Muy bien!" text particles
  - CSS animations (no heavy libs)
</div>
```

**CSS:**
```css
.confetti {
  position: absolute;
  width: 10px; height: 10px;
  animation: confetti-fall 3s ease-in forwards;
}
@keyframes confetti-fall {
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
```

**done when:**
- Confetti animation plays on celebration
- Stars float upward
- "¡Muy bien!" particles appear
- No heavy libraries used

---

### Task 5: Position Overlays Relative to AR
type: auto
tdd: false

**behavior:**
Position all educational overlays relative to the AR scene and Tina's position.

**implementation:**
- Calculate overlay positions based on viewport
- Account for camera position
- Adjust for different screen sizes
- z-index management for layering

**done when:**
- Overlays position correctly
- Work on mobile and tablet
- Don't block AR view unnecessarily

---

### Task 6: Add Overlay Methods to UI Manager
type: auto
tdd: false

**behavior:**
Add methods to ui-manager.js to show/hide educational overlays based on state.

**implementation:**
```javascript
// Add to ui-manager.js
showBrushAngleArrow(zone) { ... }
showCircularMotion(zone) { ... }
hideAllOverlays() { ... }
showCelebrationParticles() { ... }
hideCelebrationParticles() { ... }
```

**done when:**
- Methods control overlay visibility
- Overlays sync with state machine
- Transitions are smooth

---

## Verification

1. Arrow shows 45° brush angle during zones
2. Circular motion indicator rotates
3. Celebration particles appear on completion
4. Overlays position correctly on mobile
5. All CSS animations are smooth (60fps)

## Success Criteria
- [ ] Arrow overlay showing 45° angle
- [ ] Circular motion indicators
- [ ] Zone indicator overlays
- [ ] Celebration confetti and stars
- [ ] Proper positioning and z-index
- [ ] Integrated with state machine

## Output
- Updated src/ui-manager.js
- Updated css/styles.css
- Updated index.html with overlay elements

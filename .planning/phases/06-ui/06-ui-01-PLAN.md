---
phase: 06-ui
plan: 01
type: implementation
autonomous: true
wave: 1
depends_on: [05-animation-01]
requirements: [UI-01, UI-02, UI-03]
---

# Phase 6 Plan 01: UI Base Implementation

## Objective
Implement the base UI components: loading overlay, timer visualization, and state messages.

## Context
- Phase 1-5 COMPLETE
- animation-manager.js with 6 animations
- audio-manager.js with TTS in 3 languages
- state-manager.js with 7 states + timer
- index.html has basic loading overlay
- css/styles.css has base styles

## Tasks

### Task 1: Create ui-manager.js Module
type: auto
tdd: false

**behavior:**
Create a new JavaScript module that manages all UI components with event-driven updates.

**implementation:**
```javascript
// src/ui-manager.js
// - Import state machine events
// - Initialize UI container references
// - Bind to stateChange, timerTick events
// - Provide methods: showLoading, hideLoading, updateTimer, showMessage, etc.
// - Handle language selector
// - Export singleton uiManager
```

**done when:**
- File src/ui-manager.js exists
- Module exports uiManager singleton
- Basic event bindings are in place

---

### Task 2: Enhance Loading Overlay (UI-01)
type: auto
tdd: false

**behavior:**
Enhance the existing loading overlay with animated spinner and "Cargando..." text that automatically hides when AR is ready.

**implementation:**
- Improve spinner animation with CSS
- Add "Cargando..." text with language support
- Add progress indicators for asset loading
- Smooth fade-out transition when ready

**done when:**
- Loading overlay shows spinner + text
- Transitions smoothly when AR ready
- Works in all 3 languages

---

### Task 3: Implement Circular Timer (UI-02)
type: auto
tdd: false

**behavior:**
Create a circular progress indicator for the 30-second zone timer with color transitions (green → yellow → red).

**implementation:**
```html
<!-- SVG-based circular timer -->
- SVG circle with stroke-dasharray animation
- Color transitions based on time remaining:
  - 30-10s: Green (#4CAF50)
  - 10-5s: Yellow (#FFC107)  
  - 5-0s: Red (#F44336)
- Zone name label inside circle
- Countdown number display
```

**done when:**
- Circular timer displays in zone states
- Colors transition correctly
- Shows zone name and countdown

---

### Task 4: State Messages & Language Selector (UI-03)
type: auto
tdd: false

**behavior:**
Display state-specific messages and provide a touch-friendly language selector with ES/EN/PT buttons.

**implementation:**
- Message display component that updates on state change
- Language selector with 3 buttons (ES, EN, PT)
- Touch-friendly button sizes (min 44x44px)
- Active language highlighted
- Responsive text sizing
- Accessible contrast ratios (WCAG AA)

**done when:**
- Messages display for each state
- Language selector works in all languages
- Buttons are touch-friendly
- Good contrast on all backgrounds

---

### Task 5: Integrate UI Manager with App
type: auto
tdd: false

**behavior:**
Connect ui-manager.js with app.js and update index.html with all UI elements.

**implementation:**
- Import uiManager in app.js
- Add UI HTML elements to index.html
- Wire up event listeners
- Test full integration

**done when:**
- UI components render correctly
- Timer updates in real-time
- Language selector changes language
- Messages update with state

---

## Verification

1. Loading overlay appears and hides on AR ready
2. Circular timer shows during zone states
3. Timer colors transition correctly
4. Messages display for each state
5. Language selector switches languages

## Success Criteria
- [ ] ui-manager.js module created
- [ ] Loading overlay enhanced
- [ ] Circular timer implemented
- [ ] State messages working
- [ ] Language selector functional
- [ ] All integrated with app.js

## Output
- src/ui-manager.js
- Updated css/styles.css
- Updated index.html

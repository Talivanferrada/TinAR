---
phase: 03-states
plan: 01
type: auto
autonomous: true
wave: 1
depends_on: [02-ar-core-01, 02-ar-core-02]
requirements: [STATE-01, STATE-02, STATE-03]
---

# Phase 3 Plan 1: State Manager Implementation

## Objective

Implementar state-manager.js con máquina de estados para controlar el flujo: LOADING → INTRO → ZONES → CELEBRATION

## Context

@STATE.md - Decisions locked: 30 segundos por zona, 2 minutos total
@ROADMAP.md - Requirements: STATE-01, STATE-02, STATE-03

## State Machine Design

```
LOADING → INTRO → ZONE_1 → ZONE_2 → ZONE_3 → ZONE_4 → CELEBRATION
```

**States:**
| State | Description | Duration |
|-------|-------------|----------|
| LOADING | Assets loading, AR initialization | Until AR ready |
| INTRO | Tina waves, welcome message | User interaction to proceed |
| ZONE_1 | Superior derecho (right upper) | 30 seconds |
| ZONE_2 | Superior izquierdo (left upper) | 30 seconds |
| ZONE_3 | Inferior derecho (right lower) | 30 seconds |
| ZONE_4 | Inferior izquierdo (left lower) | 30 seconds |
| CELEBRATION | Tina celebrates, confetti | Until user exits |

## Tasks

### Task 1: Create state-manager.js module
- type: auto
- ES6 module export
- StateMachine class with:
  - `states` enum/constant
  - `currentState` property
  - `transition(newState)` method
  - Event emission via document.dispatchEvent
- Events: 'stateChange', 'timerTick', 'timerComplete'

### Task 2: Implement Timer system
- type: auto
- Timer class with:
  - `start(duration)`, `pause()`, `resume()`, `reset()`
  - `tick` event every second
  - `complete` event when timer ends
- Integration with state transitions

### Task 3: Integrate with app.js
- type: auto
- Import state-manager in app.js
- Initialize state machine on app init
- Connect AR events to state transitions:
  - arReady → LOADING complete → INTRO
  - targetFound → Start brushing flow
  - targetLost → Pause timer

## Verification

1. State transitions fire correct events
2. Timer counts down correctly (30s per zone)
3. Pause/resume works correctly
4. Integration with app.js functions

## Success Criteria

- [ ] state-manager.js created as ES6 module
- [ ] 7 states defined: LOADING, INTRO, ZONE_1-4, CELEBRATION
- [ ] Timer 30 seconds per zone with pause/resume
- [ ] Events emitted: stateChange, timerTick, timerComplete
- [ ] app.js integrated with state-manager

## Output

- `src/state-manager.js` - State machine module
- `src/app.js` - Updated with state-manager integration

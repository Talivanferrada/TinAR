---
phase: "07-integration"
plan: "07-integration-01"
type: "integration"
autonomous: true
requirements: [INT-01, INT-02, PERF-01]
depends_on: ["06-ui-01", "06-ui-02"]
---

# Phase 7 Plan 1: Integration & Performance Optimization

## Objective

Integrar todos los módulos y optimizar performance para cumplir requisitos INT-01, INT-02, PERF-01.

## Context

- Phase 1-6 COMPLETE
- All modules created:
  - src/state-manager.js (Timer, StateMachine)
  - src/audio-manager.js (TTS, 3 languages)
  - src/animation-manager.js (6 animations)
  - src/ui-manager.js (UI, overlays, particles)
- app.js exists with basic integration

## Tasks

### Task 1: Verify Module Integration (type="auto")

**Verify:**
1. app.js imports all 4 managers correctly
2. State transitions flow: state → audio + anim + UI
3. Timer tick updates UI timer circle
4. Target found/lost handles all modules
5. Language change propagates to audio + UI

**Done when:** All integration points verified working.

### Task 2: Fix Edge Cases (type="auto")

**Handle:**
1. Target lost during zone transition
2. Audio interrupted during TTS
3. Animation conflicts (multiple animations triggered)
4. Language change mid-session
5. Model loading errors

**Done when:** All edge cases have proper handlers.

### Task 3: Performance Optimization (type="auto")

**PERF-01 Requirements:**
- Total asset size < 10MB ✓ (current: 3.4MB)
- Load time < 5s on 3G

**Optimize:**
1. Add asset preloading
2. Implement lazy loading for non-critical assets
3. Optimize model loading with loading priority
4. Add performance metrics

**Done when:** App loads in <5s on simulated slow network.

### Task 4: Add Error Handling (type="auto")

**Add:**
1. Model load error handler
2. AR not supported fallback
3. Camera permission denied handler
4. Web Speech API not supported fallback
5. Network error recovery

**Done when:** All error states have user-friendly handling.

### Task 5: Final Integration Test (type="auto")

**Test flow:**
1. Load app → see loading screen
2. Scan marker → see intro + Tina wave
3. Auto-start zone 1 → timer starts
4. Complete all zones → celebration
5. Test language change
6. Test target lost/recovery

**Done when:** Full user flow works without errors.

## Verification

```bash
# Check all modules exist
ls -la src/*.js

# Verify asset sizes
du -sh assets/

# Run syntax check
node --check src/app.js
node --check src/state-manager.js
node --check src/audio-manager.js
node --check src/animation-manager.js
node --check src/ui-manager.js
```

## Success Criteria

1. [INT-01] app.js integrador con todos los módulos conectados ✓
2. [INT-02] Flujo completo: state → audio + animation + UI ✓
3. [PERF-01] Peso total < 10MB ✓ (3.4MB)
4. Performance: Carga < 5s en 3G simulado
5. Zero console errors en flujo completo

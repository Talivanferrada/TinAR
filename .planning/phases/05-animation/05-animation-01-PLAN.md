---
phase: 05-animation
plan: 01
type: implementation
autonomous: true
wave: 1
depends_on: [04-audio-01]

requirements: [ANIM-01, ANIM-02, ANIM-03]

objective: Implement animation-manager.js module with simulated animations for Tina (static 3D model) synchronized with state machine

context:
  - "@.planning/STATE.md"
  - "@src/state-manager.js"
  - "@src/app.js"

tasks:
  - id: T1
    type: auto
    name: Create animation-manager.js module
    behavior: |
      Create src/animation-manager.js as ES6 module with AFRAME animation system for Tina:
      - Animation definitions for all states (wave, breathing, pointing, dancing, jumping, celebration)
      - Animation queue to prevent conflicts
      - Synchronization with state machine events
      - 60fps performance optimization
    implementation: |
      Export ANIMATIONS constant with all animation configs:
        - wave: Y-axis rotation for INTRO state (2s, no loop)
        - breathing: Scale oscillation for idle (3s, loop)
        - pointing: Rotation toward zone direction (1s)
        - dancing: Bounce + rotation during zone brushing (loop)
        - jumping: Y translation jump for zone complete (0.5s)
        - celebration: Jump + spin + scale pulse for end (3s)
      
      Export AnimationManager class with:
        - constructor(): Get Tina entity reference
        - _init(): Setup animation queue and state listeners
        - _bindStateEvents(): Listen to stateChange events
        - _queueAnimation(animation): Add to animation queue
        - _playNext(): Process queue, play next animation
        - play(name, options): Play specific animation
        - stop(): Stop current animation
        - stopAll(): Clear queue and stop
        - setDefault(animation): Set default idle animation
        - _applyAnimation(entity, config): Apply AFRAME animation
        - _removeAnimation(entity): Remove animation component
        - syncWithState(state): Play appropriate animation for state
      
      Default animation: 'breathing' when idle
      
      Export singleton animationManager instance
    done_criteria:
      - animation-manager.js created as ES6 module
      - All 6 animations defined
      - Animation queue prevents conflicts
      - State synchronization implemented
      - Performance optimized for 60fps
    commit: feat(05-animation-01): create animation-manager.js with all animations

  - id: T2
    type: auto
    name: Integrate animation-manager with app.js
    behavior: |
      Update app.js to import and use animation-manager for all state transitions
    implementation: |
      Import animationManager from animation-manager.js
      
      Update showIntro() to call animationManager.play('wave')
      Update showZone() to call animationManager.syncWithState(zone)
      Update showCelebration() to call animationManager.play('celebration')
      Update onTargetFound() to trigger animation based on state
      Update onTargetLost() to call animationManager.stopAll()
      
      Add zone complete animation in _onTimerComplete():
        - Play 'jumping' animation when zone timer completes
    done_criteria:
      - app.js imports animation-manager
      - Animations play on all state transitions
      - Zone transitions trigger correct animations
      - Default breathing when idle
    commit: feat(05-animation-01): integrate animation-manager with app.js

verification:
  - Check animation-manager.js exports ANIMATIONS, AnimationManager, animationManager
  - Check app.js imports and uses animationManager
  - Verify all 6 animations have proper configs
  - Verify animation queue prevents conflicts

success_criteria:
  - All 6 animations implemented (wave, breathing, pointing, dancing, jumping, celebration)
  - Synchronized with state machine
  - 60fps smooth performance
  - Queue prevents animation conflicts
  - Default breathing animation when idle

output:
  files:
    created: [src/animation-manager.js]
    modified: [src/app.js]
  exports:
    - ANIMATIONS
    - AnimationManager class
    - animationManager singleton

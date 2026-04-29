// TinAR - Animation Manager Module
// Simulated animations for Tina (static 3D model) using AFRAME animation component

import { STATES } from './state-manager.js';

// Animation configurations for all states
export const ANIMATIONS = {
  // Wave: Tina waves hello (INTRO state)
  // Rotate model on Y axis (side-to-side wave)
  wave: {
    property: 'rotation',
    from: '0 0 0',
    to: '0 30 0',
    dur: 1000,
    easing: 'easeInOutQuad',
    loop: false,
    dir: 'alternate'
  },
  
  // Breathing: Idle animation (default)
  // Gentle scale oscillation
  breathing: {
    property: 'scale',
    from: '1.5 1.5 1.5',
    to: '1.55 1.55 1.55',
    dur: 3000,
    easing: 'easeInOutSine',
    loop: true,
    dir: 'alternate'
  },
  
  // Pointing: Point to current zone (ZONE states)
  // Slight rotation toward zone direction
  pointing: {
    property: 'rotation',
    from: '0 0 0',
    to: '0 15 0',
    dur: 1000,
    easing: 'easeOutQuad',
    loop: false
  },
  
  // Dancing: Happy movement during brushing
  // Bounce + rotation combination
  dancing: {
    property: 'position',
    from: '0 0.5 0',
    to: '0 0.55 0',
    dur: 500,
    easing: 'easeInOutQuad',
    loop: true,
    dir: 'alternate'
  },
  
  // Jumping: Excitement during zone complete
  // Jump up (translate Y), land
  jumping: {
    property: 'position',
    from: '0 0.5 0',
    to: '0 0.7 0',
    dur: 250,
    easing: 'easeOutQuad',
    loop: false,
    dir: 'alternate'
  },
  
  // Celebration: Big celebration at end
  // Jump + spin + scale pulse
  celebration: {
    property: 'rotation',
    from: '0 0 0',
    to: '0 360 0',
    dur: 1500,
    easing: 'easeInOutQuad',
    loop: false
  }
};

// Zone-specific pointing directions
const ZONE_DIRECTIONS = {
  [STATES.ZONE_1]: { rotation: '0 -20 0', name: 'right upper' },
  [STATES.ZONE_2]: { rotation: '0 20 0', name: 'left upper' },
  [STATES.ZONE_3]: { rotation: '0 -15 10', name: 'right lower' },
  [STATES.ZONE_4]: { rotation: '0 15 10', name: 'left lower' }
};

/**
 * Animation Manager class
 * Handles all Tina animations using AFRAME animation component
 */
export class AnimationManager {
  constructor() {
    this.tinaEntity = null;
    this.currentAnimation = null;
    this.animationQueue = [];
    this.isPlaying = false;
    this.defaultAnimation = 'breathing';
    this.initialized = false;
    
    // Bind methods
    this._onAnimationComplete = this._onAnimationComplete.bind(this);
  }
  
  /**
   * Initialize animation manager
   */
  _init() {
    if (this.initialized) return;
    
    // Wait for Tina entity to be available
    this._waitForTinaEntity();
    
    // Bind state events
    this._bindStateEvents();
    
    this.initialized = true;
    console.log('🎬 Animation manager initialized');
  }
  
  /**
   * Wait for Tina entity to be created
   */
  _waitForTinaEntity() {
    const checkInterval = setInterval(() => {
      const entity = document.getElementById('tina');
      if (entity) {
        this.tinaEntity = entity;
        clearInterval(checkInterval);
        console.log('🦕 Tina entity found for animations');
        
        // Start default animation
        this.play(this.defaultAnimation);
      }
    }, 100);
    
    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 10000);
  }
  
  /**
   * Bind state machine events
   */
  _bindStateEvents() {
    document.addEventListener('stateChange', (event) => {
      this._onStateChange(event.detail);
    });
  }
  
  /**
   * Handle state change events
   */
  _onStateChange(detail) {
    const { state } = detail;
    this.syncWithState(state);
  }
  
  /**
   * Queue an animation to prevent conflicts
   */
  _queueAnimation(animation, options = {}) {
    this.animationQueue.push({ animation, options });
    
    if (!this.isPlaying) {
      this._playNext();
    }
  }
  
  /**
   * Play next animation in queue
   */
  _playNext() {
    if (this.animationQueue.length === 0) {
      // Return to default animation when queue is empty
      if (this.currentAnimation !== this.defaultAnimation) {
        this.play(this.defaultAnimation);
      }
      return;
    }
    
    const { animation, options } = this.animationQueue.shift();
    this.play(animation, options);
  }
  
  /**
   * Play a specific animation
   */
  play(name, options = {}) {
    if (!this.tinaEntity) {
      console.warn('Tina entity not available for animation');
      return false;
    }
    
    const config = ANIMATIONS[name];
    if (!config) {
      console.error(`Animation not found: ${name}`);
      return false;
    }
    
    // Stop current animation first
    this._stopCurrentAnimation();
    
    // Apply new animation
    const finalConfig = { ...config, ...options };
    this._applyAnimation(this.tinaEntity, name, finalConfig);
    
    this.currentAnimation = name;
    this.isPlaying = true;
    
    console.log(`🎬 Playing animation: ${name}`);
    return true;
  }
  
  /**
   * Stop current animation
   */
  _stopCurrentAnimation() {
    if (this.tinaEntity) {
      this._removeAnimation(this.tinaEntity);
    }
    this.isPlaying = false;
  }
  
  /**
   * Stop all animations and clear queue
   */
  stopAll() {
    this.animationQueue = [];
    this._stopCurrentAnimation();
    console.log('🎬 All animations stopped');
  }
  
  /**
   * Set default animation (played when queue is empty)
   */
  setDefault(name) {
    if (ANIMATIONS[name]) {
      this.defaultAnimation = name;
      console.log(`🎬 Default animation set to: ${name}`);
    }
  }
  
  /**
   * Apply animation to entity using AFRAME animation component
   */
  _applyAnimation(entity, name, config) {
    // Remove any existing animation
    this._removeAnimation(entity);
    
    // Build animation attribute string
    const animAttr = {
      property: config.property,
      to: config.to,
      from: config.from,
      dur: config.dur,
      easing: config.easing || 'easeInOutQuad',
      loop: config.loop ? true : false,
      dir: config.dir || 'normal'
    };
    
    // Set animation component
    entity.setAttribute('animation', animAttr);
    
    // Store animation name for reference
    entity.setAttribute('data-animation', name);
    
    // Listen for animation complete (non-looping)
    if (!config.loop) {
      entity.addEventListener('animationcomplete', this._onAnimationComplete, { once: true });
    }
  }
  
  /**
   * Remove animation from entity
   */
  _removeAnimation(entity) {
    entity.removeAttribute('animation');
    entity.removeAttribute('data-animation');
    entity.removeEventListener('animationcomplete', this._onAnimationComplete);
  }
  
  /**
   * Handle animation complete event
   */
  _onAnimationComplete(event) {
    console.log(`🎬 Animation complete: ${this.currentAnimation}`);
    this.isPlaying = false;
    
    // Play next in queue or return to default
    this._playNext();
  }
  
  /**
   * Synchronize animation with state
   */
  syncWithState(state) {
    console.log(`🎬 Syncing animation with state: ${state}`);
    
    switch (state) {
      case STATES.INTRO:
        // Wave hello
        this.play('wave');
        break;
        
      case STATES.ZONE_1:
      case STATES.ZONE_2:
      case STATES.ZONE_3:
      case STATES.ZONE_4:
        // Point to zone direction
        this._playZoneAnimation(state);
        break;
        
      case STATES.CELEBRATION:
        // Big celebration
        this.play('celebration');
        break;
        
      default:
        // Default breathing
        this.play(this.defaultAnimation);
    }
  }
  
  /**
   * Play zone-specific animation
   */
  _playZoneAnimation(zone) {
    if (!this.tinaEntity) return;
    
    const direction = ZONE_DIRECTIONS[zone];
    if (!direction) return;
    
    // Stop current animation
    this._stopCurrentAnimation();
    
    // Point toward zone
    const pointingConfig = {
      ...ANIMATIONS.pointing,
      to: direction.rotation
    };
    
    this._applyAnimation(this.tinaEntity, 'pointing', pointingConfig);
    this.currentAnimation = 'pointing';
    this.isPlaying = true;
    
    console.log(`🎬 Pointing to zone: ${direction.name}`);
    
    // After pointing, start dancing animation
    setTimeout(() => {
      if (this.currentAnimation === 'pointing') {
        this.play('dancing');
      }
    }, 1500);
  }
  
  /**
   * Play zone complete celebration
   */
  playZoneComplete() {
    // Quick jump animation
    this._queueAnimation('jumping');
    console.log('🎬 Zone complete - jumping!');
  }
  
  /**
   * Get current animation name
   */
  getCurrentAnimation() {
    return this.currentAnimation;
  }
  
  /**
   * Check if animation is playing
   */
  isAnimationPlaying() {
    return this.isPlaying;
  }
  
  /**
   * Get available animations
   */
  getAvailableAnimations() {
    return Object.keys(ANIMATIONS);
  }
}

// Create singleton instance
export const animationManager = new AnimationManager();

// Auto-initialize when module is imported
animationManager._init();

// Default export
export default animationManager;

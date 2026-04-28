// TinAR - Main Application
// WebAR Educativo para Salud Dental Infantil

import { stateMachine, STATES, ZONE_CONFIG } from './state-manager.js';
import { audioManager, LANGUAGES } from './audio-manager.js';
import { animationManager } from './animation-manager.js';
import { uiManager } from './ui-manager.js';

class TinARApp {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.tinaModel = null;
    this.isLoaded = false;
    this.isTracking = false;
    this.stateMachine = stateMachine;
    this.encouragementTimer = 0;
    this.encouragementInterval = 10; // Speak every 10 seconds
    
    this.init();
  }
  
  async init() {
    console.log('🦕 TinAR initializing...');
    
    // Bind state events
    this._bindStateEvents();
    
    // Wait for AFRAME to load
    if (document.readyState === 'complete') {
      this.onSceneReady();
    } else {
      window.addEventListener('load', () => this.onSceneReady());
    }
  }
  
  _bindStateEvents() {
    // Listen for state changes
    document.addEventListener('stateChange', (event) => {
      this._onStateChange(event.detail);
    });
    
    // Listen for timer ticks
    document.addEventListener('timerTick', (event) => {
      this._onTimerTick(event.detail);
    });
    
    // Listen for timer complete
    document.addEventListener('timerComplete', (event) => {
      this._onTimerComplete(event.detail);
    });
  }
  
  _onStateChange(detail) {
    console.log(`📍 App: State changed to ${detail.state}`);
    
    // Handle state-specific logic
    switch (detail.state) {
      case STATES.INTRO:
        this.showIntro();
        break;
      case STATES.ZONE_1:
      case STATES.ZONE_2:
      case STATES.ZONE_3:
      case STATES.ZONE_4:
        this.showZone(detail.state);
        break;
      case STATES.CELEBRATION:
        this.showCelebration();
        break;
    }
  }
  
  _onTimerTick(detail) {
    // Update UI with timer progress
    this.updateTimerUI(detail);
    
    // Speak encouragement periodically
    this.encouragementTimer++;
    if (this.encouragementTimer >= this.encouragementInterval && detail.seconds > 5) {
      this.encouragementTimer = 0;
      audioManager.speakEncouragement();
    }
  }
  
  _onTimerComplete(detail) {
    console.log('⏱️ Zone timer complete');
    // Play jumping animation when zone is complete
    animationManager.playZoneComplete();
  }
  
  onSceneReady() {
    const scene = document.querySelector('a-scene');
    
    if (scene.hasLoaded) {
      this.setupScene();
    } else {
      scene.addEventListener('loaded', () => this.setupScene());
    }
    
    // Handle AR events
    scene.addEventListener('arReady', () => {
      console.log('AR Ready');
      this.hideLoading();
    });
    
    // Handle target found
    const target = document.getElementById('target');
    target.addEventListener('targetFound', () => {
      console.log('🎯 Target found!');
      this.isTracking = true;
      this.onTargetFound();
    });
    
    target.addEventListener('targetLost', () => {
      console.log('Target lost - pausing timer');
      this.isTracking = false;
      
      // Pause timer when target is lost
      this.stateMachine.pause();
      
      // Stop all animations
      animationManager.stopAll();
      
      // Play audio and show message to find marker
      audioManager.speakTargetLost();
      uiManager.showTargetLost();
    });
  }
  
  setupScene() {
    console.log('Setting up scene...');
    this.scene = document.querySelector('a-scene');
  }
  
  hideLoading() {
    // Delegate to UI manager
    uiManager.hideLoading();
    this.isLoaded = true;
    
    // Transition to INTRO state
    this.stateMachine.startIntro();
  }
  
  onTargetFound() {
    if (!this.tinaModel) {
      this.loadTinaModel();
    }
    
    // Resume timer if paused
    this.stateMachine.resume();
    
    // Resume appropriate animation based on current state
    const currentState = this.stateMachine.currentState;
    animationManager.syncWithState(currentState);
    
    // If in INTRO, start brushing on target found
    if (currentState === STATES.INTRO) {
      this.stateMachine.startBrushing();
    }
  }
  
  async loadTinaModel() {
    const container = document.getElementById('tina-container');
    
    // Create entity for Tina
    const tinaEntity = document.createElement('a-entity');
    tinaEntity.setAttribute('id', 'tina');
    tinaEntity.setAttribute('gltf-model', '#tina-model');
    
    // Position and scale (adjust based on model)
    tinaEntity.setAttribute('position', '0 0 0.1');
    tinaEntity.setAttribute('scale', '0.3 0.3 0.3');
    tinaEntity.setAttribute('rotation', '0 0 0');
    
    // Add idle breathing animation (simulated)
    tinaEntity.setAttribute('animation', {
      property: 'scale',
      to: '0.31 0.31 0.31',
      dur: 2000,
      easing: 'easeInOutQuad',
      loop: true,
      dir: 'alternate'
    });
    
    container.appendChild(tinaEntity);
    this.tinaModel = tinaEntity;
    
    console.log('🦕 Tina model loaded!');
    return tinaEntity;
  }
  
  // State handlers
  showIntro() {
    console.log('👋 Showing intro - Tina waves');
    // Trigger wave animation
    animationManager.play('wave');
    // Play welcome audio
    audioManager.speakIntro();
    // UI message handled by uiManager via stateChange event
  }
  
  showZone(zone) {
    const config = ZONE_CONFIG[zone];
    console.log(`🦷 Zone: ${config.name} (${config.duration / 1000}s)`);
    // Trigger pointing animation toward zone direction
    animationManager.syncWithState(zone);
    // Play zone audio with educational content
    audioManager.speakZone(zone);
    // UI timer and message handled by uiManager via stateChange event
  }
  
  showCelebration() {
    console.log('🎉 Celebration time!');
    // Trigger celebration animation (spin + jump)
    animationManager.play('celebration');
    // Play celebration audio
    audioManager.speakCelebration();
    // Celebration particles handled by uiManager via stateChange event
  }
  
  updateTimerUI(detail) {
    // UI timer display handled by uiManager via timerTick event
    // This method just logs and handles encouragement timing
    console.log(`⏱️ Timer: ${detail.seconds}s remaining`);
  }
  
  // Audio/Language methods
  setLanguage(langCode) {
    audioManager.setLanguage(langCode);
  }
  
  getLanguage() {
    return audioManager.getLanguage();
  }
  
  getSupportedLanguages() {
    return Object.entries(LANGUAGES).map(([name, code]) => ({
      name,
      code
    }));
  }
  
  toggleAudio() {
    return audioManager.toggle();
  }
  
  speakEncouragement() {
    audioManager.speakEncouragement();
  }
}

// Initialize app
const app = new TinARApp();
export default app;

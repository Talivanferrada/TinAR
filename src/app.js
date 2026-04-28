// TinAR - Main Application
// WebAR Educativo para Salud Dental Infantil

import { stateMachine, STATES, ZONE_CONFIG } from './state-manager.js';
import { audioManager, LANGUAGES } from './audio-manager.js';

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
      
      // Play audio and show message to find marker
      audioManager.speakTargetLost();
      this.showMessage('Apunta la cámara al marcador para continuar');
    });
  }
  
  setupScene() {
    console.log('Setting up scene...');
    this.scene = document.querySelector('a-scene');
  }
  
  hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 500);
    }
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
    
    // If in INTRO, start brushing on target found
    if (this.stateMachine.currentState === STATES.INTRO) {
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
    // TODO: Trigger wave animation (Phase 5)
    // Play welcome audio
    audioManager.speakIntro();
    this.showMessage('¡Hola! Soy Tina, tu amiga diente. ¡Vamos a cepillarnos juntos!');
  }
  
  showZone(zone) {
    const config = ZONE_CONFIG[zone];
    console.log(`🦷 Zone: ${config.name} (${config.duration / 1000}s)`);
    // TODO: Trigger pointing animation to zone (Phase 5)
    // Play zone audio with educational content
    audioManager.speakZone(zone);
    this.showMessage(`Cepilla la zona: ${config.name}`);
  }
  
  showCelebration() {
    console.log('🎉 Celebration time!');
    // TODO: Trigger celebration animation (Phase 5)
    // Play celebration audio
    audioManager.speakCelebration();
    // TODO: Show confetti (Phase 6)
    this.showMessage('¡Excelente! ¡Terminaste el cepillado! 🦷✨');
  }
  
  updateTimerUI(detail) {
    // Update timer display
    const timerElement = document.getElementById('timer-display');
    if (timerElement) {
      timerElement.textContent = detail.seconds;
    }
    console.log(`⏱️ Timer: ${detail.seconds}s remaining`);
  }
  
  showMessage(text) {
    const messageElement = document.getElementById('message-display');
    if (messageElement) {
      messageElement.textContent = text;
      messageElement.style.opacity = '1';
    }
    console.log(`💬 ${text}`);
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

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
    this.modelLoadAttempts = 0;
    this.maxModelLoadAttempts = 3;
    this.arSupported = false;
    
    this.init();
  }
  
  async init() {
    console.log('🦕 TinAR initializing...');
    
    // Check AR support first
    if (!this._checkARSupport()) {
      this._showARNotSupported();
      return;
    }
    
    // Bind state events
    this._bindStateEvents();
    
    // Wait for AFRAME to load
    if (document.readyState === 'complete') {
      this.onSceneReady();
    } else {
      window.addEventListener('load', () => this.onSceneReady());
    }
  }
  
  /**
   * Check if AR is supported
   */
  _checkARSupport() {
    // Check for WebGL
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.error('❌ WebGL not supported');
      return false;
    }
    
    // Check for WebXR (optional, MindAR doesn't require it)
    this.arSupported = true;
    console.log('✅ AR support check passed');
    return true;
  }
  
  /**
   * Show AR not supported message
   */
  _showARNotSupported() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.innerHTML = `
        <div style="text-align: center; color: white; padding: 20px;">
          <h2>⚠️ AR No Soportado</h2>
          <p>Tu dispositivo no soporta realidad aumentada.</p>
          <p>Por favor usa un dispositivo compatible con WebGL.</p>
        </div>
      `;
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
    
    if (!scene) {
      console.error('❌ A-Frame scene not found');
      this._showError('Error loading AR scene');
      return;
    }
    
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
    
    // Handle AR errors
    scene.addEventListener('arError', (event) => {
      console.error('❌ AR Error:', event.detail);
      this._handleARError(event.detail);
    });
    
    // Handle camera permission
    this._requestCameraPermission();
    
    // Handle target found
    const target = document.getElementById('target');
    if (!target) {
      console.error('❌ Target element not found');
      return;
    }
    
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
  
  /**
   * Request camera permission
   */
  async _requestCameraPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      // Stop the test stream immediately
      stream.getTracks().forEach(track => track.stop());
      console.log('✅ Camera permission granted');
    } catch (error) {
      console.error('❌ Camera permission denied:', error);
      this._handleCameraDenied();
    }
  }
  
  /**
   * Handle camera permission denied
   */
  _handleCameraDenied() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.innerHTML = `
        <div style="text-align: center; color: white; padding: 20px;">
          <h2>📷 Cámara Requerida</h2>
          <p>Por favor permite el acceso a la cámara para usar esta experiencia AR.</p>
          <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; 
            background: white; border: none; border-radius: 25px; font-size: 16px; cursor: pointer;">
            Reintentar
          </button>
        </div>
      `;
    }
  }
  
  /**
   * Handle AR errors
   */
  _handleARError(error) {
    console.error('AR Error:', error);
    this._showError('Error iniciando realidad aumentada. Por favor recarga la página.');
  }
  
  /**
   * Show generic error message
   */
  _showError(message) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      const textEl = document.getElementById('loading-text');
      if (textEl) {
        textEl.textContent = `❌ ${message}`;
        textEl.style.color = '#FF6B6B';
      }
    }
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
    
    if (!container) {
      console.error('❌ Tina container not found');
      return null;
    }
    
    // Create entity for Tina
    const tinaEntity = document.createElement('a-entity');
    tinaEntity.setAttribute('id', 'tina');
    tinaEntity.setAttribute('gltf-model', '#tina-model');
    
    // Position and scale - model appears ABOVE the marker
    tinaEntity.setAttribute('position', '0 0.5 0');  // Raised above marker
    tinaEntity.setAttribute('scale', '1.5 1.5 1.5');  // Larger scale for visibility
    tinaEntity.setAttribute('rotation', '0 180 0');  // Face the camera
    
    // Add idle breathing animation (simulated)
    tinaEntity.setAttribute('animation', {
      property: 'scale',
      to: '1.55 1.55 1.55',
      dur: 2000,
      easing: 'easeInOutQuad',
      loop: true,
      dir: 'alternate'
    });
    
    // Handle model load events
    tinaEntity.addEventListener('model-loaded', () => {
      console.log('🦕 Tina model loaded successfully!');
      this.modelLoadAttempts = 0;
    });
    
    tinaEntity.addEventListener('model-error', (error) => {
      console.error('❌ Tina model load error:', error);
      this._handleModelError();
    });
    
    container.appendChild(tinaEntity);
    this.tinaModel = tinaEntity;
    
    console.log('🦕 Tina model entity created, waiting for load...');
    return tinaEntity;
  }
  
  /**
   * Handle model loading error with retry
   */
  _handleModelError() {
    this.modelLoadAttempts++;
    
    if (this.modelLoadAttempts < this.maxModelLoadAttempts) {
      console.log(`🔄 Retrying model load (attempt ${this.modelLoadAttempts}/${this.maxModelLoadAttempts})`);
      // Remove failed entity
      if (this.tinaModel) {
        this.tinaModel.remove();
        this.tinaModel = null;
      }
      // Retry after delay
      setTimeout(() => this.loadTinaModel(), 1000);
    } else {
      console.error('❌ Max model load attempts reached');
      this._showError('No se pudo cargar el modelo 3D. Verifica tu conexión.');
    }
  }
  
  // State handlers
  showIntro() {
    console.log('👋 Showing intro - Tina waves');
    
    // Only trigger wave animation if model is loaded
    if (this.tinaModel) {
      animationManager.play('wave');
    } else {
      // Queue animation for when model loads
      setTimeout(() => {
        if (this.tinaModel) {
          animationManager.play('wave');
        }
      }, 1000);
    }
    
    // Play welcome audio
    audioManager.speakIntro();
    // UI message handled by uiManager via stateChange event
  }
  
  showZone(zone) {
    const config = ZONE_CONFIG[zone];
    console.log(`🦷 Zone: ${config.name} (${config.duration / 1000}s)`);
    
    // Reset encouragement timer for new zone
    this.encouragementTimer = 0;
    
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
  
  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    
    return {
      loadTime: loadTime,
      isLoaded: this.isLoaded,
      isTracking: this.isTracking,
      modelLoaded: !!this.tinaModel,
      arSupported: this.arSupported,
      currentState: this.stateMachine.currentState
    };
  }
  
  /**
   * Restart the experience
   */
  restart() {
    console.log('🔄 Restarting experience...');
    this.stateMachine.restart();
    audioManager.stop();
    animationManager.stopAll();
    animationManager.play('breathing');
  }
}

// Initialize app
const app = new TinARApp();
export default app;

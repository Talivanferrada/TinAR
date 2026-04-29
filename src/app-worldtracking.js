// TinAR - World Tracking Application
// AR sin marcador usando WebXR / AR.js

import { stateMachine, STATES, ZONE_CONFIG } from './state-manager.js';
import { audioManager, LANGUAGES } from './audio-manager.js';
import { animationManager } from './animation-manager.js';
import { uiManager } from './ui-manager.js';

class TinARWorldTracking {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.tinaAnchor = null;
    this.tinaModel = null;
    this.isPlaced = false;
    this.isLoaded = false;
    this.stateMachine = stateMachine;
    this.encouragementTimer = 0;
    this.encouragementInterval = 10;
    
    this.init();
  }
  
  async init() {
    console.log('🦕 TinAR World Tracking initializing...');
    
    // Bind state events
    this._bindStateEvents();
    
    // Wait for AFRAME
    if (document.readyState === 'complete') {
      this.onSceneReady();
    } else {
      window.addEventListener('load', () => this.onSceneReady());
    }
  }
  
  _bindStateEvents() {
    document.addEventListener('stateChange', (event) => {
      this._onStateChange(event.detail);
    });
    
    document.addEventListener('timerTick', (event) => {
      this._onTimerTick(event.detail);
    });
    
    document.addEventListener('timerComplete', (event) => {
      this._onTimerComplete(event.detail);
    });
  }
  
  _onStateChange(detail) {
    console.log(`📍 State changed to ${detail.state}`);
    
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
    this.encouragementTimer++;
    if (this.encouragementTimer >= this.encouragementInterval && detail.seconds > 5) {
      this.encouragementTimer = 0;
      audioManager.speakEncouragement();
    }
  }
  
  _onTimerComplete(detail) {
    console.log('⏱️ Zone timer complete');
    animationManager.playZoneComplete();
  }
  
  onSceneReady() {
    const scene = document.querySelector('a-scene');
    
    if (!scene) {
      console.error('❌ A-Frame scene not found');
      return;
    }
    
    if (scene.hasLoaded) {
      this.setupScene();
    } else {
      scene.addEventListener('loaded', () => this.setupScene());
    }
    
    // Request camera permission
    this._requestCameraPermission();
  }
  
  async _requestCameraPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      stream.getTracks().forEach(track => track.stop());
      console.log('✅ Camera permission granted');
      
      // Hide loading, show tap instruction
      this.hideLoading();
      this.showTapInstruction();
      
    } catch (error) {
      console.error('❌ Camera permission denied:', error);
      this._handleCameraDenied();
    }
  }
  
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
  
  setupScene() {
    console.log('Setting up scene...');
    this.scene = document.querySelector('a-scene');
    this.camera = document.querySelector('[camera]');
    this.tinaAnchor = document.getElementById('tina-anchor');
    this.tinaModel = document.getElementById('tina');
    
    // Add tap listener to place Tina
    document.body.addEventListener('click', (e) => this.onTap(e));
    document.body.addEventListener('touchend', (e) => this.onTap(e));
    
    // Listen for model load
    if (this.tinaModel) {
      this.tinaModel.addEventListener('model-loaded', () => {
        console.log('🦕 Tina model loaded!');
      });
    }
  }
  
  onTap(event) {
    // Ignore if already placed or if tapping UI elements
    if (this.isPlaced) return;
    if (event.target.closest('#ui-overlay')) return;
    if (event.target.closest('.lang-btn')) return;
    if (event.target.closest('.restart-btn')) return;
    
    console.log('👆 Tap detected - placing Tina');
    
    // Place Tina at a fixed distance from camera
    this.placeTina();
  }
  
  placeTina() {
    if (!this.tinaAnchor) return;
    
    // Get camera position and rotation
    const cameraObj = this.camera.object3D;
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(cameraObj.quaternion);
    
    // Place Tina 1.5 meters in front of camera, at floor level
    const distance = 1.5;
    const position = new THREE.Vector3();
    cameraObj.getWorldPosition(position);
    
    position.x += direction.x * distance;
    position.z += direction.z * distance;
    position.y = 0; // Floor level
    
    // Set position
    this.tinaAnchor.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    this.tinaAnchor.setAttribute('visible', 'true');
    
    // Make Tina face the camera
    const cameraPos = new THREE.Vector3();
    this.camera.object3D.getWorldPosition(cameraPos);
    const angle = Math.atan2(
      cameraPos.x - position.x,
      cameraPos.z - position.z
    );
    this.tinaModel.setAttribute('rotation', `0 ${THREE.MathUtils.radToDeg(angle)} 0`);
    
    this.isPlaced = true;
    this.hideTapInstruction();
    
    console.log('🦕 Tina placed at:', position);
    
    // Start intro after a moment
    setTimeout(() => {
      this.stateMachine.startIntro();
    }, 500);
  }
  
  hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 500);
    }
  }
  
  showTapInstruction() {
    const instruction = document.getElementById('tap-instruction');
    if (instruction) {
      instruction.classList.remove('hidden');
    }
  }
  
  hideTapInstruction() {
    const instruction = document.getElementById('tap-instruction');
    if (instruction) {
      instruction.classList.add('hidden');
    }
  }
  
  showIntro() {
    console.log('👋 Intro - Tina waves');
    animationManager.play('wave');
    audioManager.speakIntro();
  }
  
  showZone(zone) {
    const config = ZONE_CONFIG[zone];
    console.log(`🦷 Zone: ${config.name}`);
    this.encouragementTimer = 0;
    animationManager.syncWithState(zone);
    audioManager.speakZone(zone);
  }
  
  showCelebration() {
    console.log('🎉 Celebration!');
    animationManager.play('celebration');
    audioManager.speakCelebration();
  }
  
  // Language methods
  setLanguage(langCode) {
    audioManager.setLanguage(langCode);
  }
  
  getLanguage() {
    return audioManager.getLanguage();
  }
  
  restart() {
    console.log('🔄 Restarting...');
    this.isPlaced = false;
    if (this.tinaAnchor) {
      this.tinaAnchor.setAttribute('visible', 'false');
    }
    this.stateMachine.restart();
    audioManager.stop();
    animationManager.stopAll();
    this.showTapInstruction();
  }
}

// Initialize
const app = new TinARWorldTracking();
export default app;

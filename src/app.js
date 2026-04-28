// TinAR - Main Application
// WebAR Educativo para Salud Dental Infantil

class TinARApp {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.tinaModel = null;
    this.isLoaded = false;
    this.isTracking = false;
    
    this.init();
  }
  
  async init() {
    console.log('🦕 TinAR initializing...');
    
    // Wait for AFRAME to load
    if (document.readyState === 'complete') {
      this.onSceneReady();
    } else {
      window.addEventListener('load', () => this.onSceneReady());
    }
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
      console.log('Target lost');
      this.isTracking = false;
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
  }
  
  onTargetFound() {
    // Will be expanded in next tasks
    console.log('Target detected - ready for content');
  }
}

// Initialize app
const app = new TinARApp();
export default app;

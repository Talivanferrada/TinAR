// TinAR - Simple Mode (No AR Tracking)
// Camera background + Tina visible always

import { stateMachine, STATES, ZONE_CONFIG } from './state-manager.js';
import { audioManager, LANGUAGES } from './audio-manager.js';

class TinARSimple {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.tinaModel = null;
    this.mixer = null;
    this.clock = new THREE.Clock();
    this.isLoaded = false;
    this.stateMachine = stateMachine;
    this.currentLanguage = 'ES';
    this.currentZone = 0;
    this.timerInterval = null;
    this.timerSeconds = 30;
    this.encouragementTimer = 0;
    
    this.init();
  }
  
  async init() {
    console.log('🦕 TinAR Simple Mode initializing...');
    
    // Setup camera
    await this.setupCamera();
    
    // Setup Three.js scene
    this.setupThreeJS();
    
    // Load Tina model
    await this.loadTina();
    
    // Setup event listeners
    this.setupEvents();
    
    // Bind state events
    this.bindStateEvents();
    
    // Start animation loop
    this.animate();
  }
  
  async setupCamera() {
    const video = document.getElementById('camera-video');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      video.srcObject = stream;
      await video.play();
      console.log('✅ Camera started');
    } catch (error) {
      console.error('❌ Camera error:', error);
      this.showCameraError();
    }
  }
  
  showCameraError() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
      loading.innerHTML = `
        <div style="text-align: center; color: white; padding: 20px;">
          <h2>📷 Cámara Requerida</h2>
          <p>Por favor permite el acceso a la cámara.</p>
          <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; 
            background: white; border: none; border-radius: 25px; font-size: 16px; cursor: pointer;">
            Reintentar
          </button>
        </div>
      `;
    }
  }
  
  setupThreeJS() {
    const canvas = document.getElementById('tina-canvas');
    
    // Scene
    this.scene = new THREE.Scene();
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    this.camera.position.set(0, 1.5, 3);
    this.camera.lookAt(0, 1, 0);
    
    // Renderer with transparency
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: canvas, 
      alpha: true, 
      antialias: true 
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setClearColor(0x000000, 0); // Transparent
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(0, 3, 2);
    this.scene.add(directionalLight);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight2.position.set(2, 2, 0);
    this.scene.add(directionalLight2);
  }
  
  async loadTina() {
    const loader = new THREE.GLTFLoader();
    
    try {
      const gltf = await new Promise((resolve, reject) => {
        loader.load(
          'assets/models/Tina_optimized.glb',
          resolve,
          (progress) => {
            const percent = (progress.loaded / progress.total * 100).toFixed(0);
            document.getElementById('loading-text').textContent = `Cargando Tina... ${percent}%`;
          },
          reject
        );
      });
      
      this.tinaModel = gltf.scene;
      this.tinaModel.scale.set(0.5, 0.5, 0.5);
      this.tinaModel.position.set(0, 0, 0);
      
      // Animation mixer if model has animations
      if (gltf.animations && gltf.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(this.tinaModel);
        // Play idle animation if exists
        gltf.animations.forEach(clip => {
          this.mixer.clipAction(clip).play();
        });
      }
      
      this.scene.add(this.tinaModel);
      
      console.log('🦕 Tina loaded!');
      this.hideLoading();
      this.startExperience();
      
    } catch (error) {
      console.error('❌ Error loading Tina:', error);
      document.getElementById('loading-text').textContent = 'Error cargando modelo';
    }
  }
  
  hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
      loading.style.opacity = '0';
      loading.style.transition = 'opacity 0.5s ease';
      setTimeout(() => loading.style.display = 'none', 500);
    }
  }
  
  setupEvents() {
    // Language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.target.dataset.lang;
        this.setLanguage(lang);
      });
    });
    
    // Resize
    window.addEventListener('resize', () => this.onResize());
  }
  
  bindStateEvents() {
    document.addEventListener('stateChange', (e) => this.onStateChange(e.detail));
    document.addEventListener('timerTick', (e) => this.onTimerTick(e.detail));
    document.addEventListener('timerComplete', (e) => this.onTimerComplete(e.detail));
  }
  
  startExperience() {
    this.isLoaded = true;
    
    // Start intro after a moment
    setTimeout(() => {
      this.stateMachine.startIntro();
    }, 500);
  }
  
  onStateChange(detail) {
    console.log(`📍 State: ${detail.state}`);
    
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
  
  showIntro() {
    this.showMessage(this.getText('INTRO'));
    audioManager.speakIntro();
    
    // Animate Tina - wave
    this.animateTina('wave');
    
    // Start brushing after intro
    setTimeout(() => {
      this.stateMachine.startBrushing();
    }, 4000);
  }
  
  showZone(zone) {
    this.currentZone = parseInt(zone.split('_')[1]);
    const config = ZONE_CONFIG[zone];
    
    // Show timer
    document.getElementById('timer-container').classList.remove('hidden');
    document.getElementById('zone-indicators').classList.remove('hidden');
    
    // Update zone indicators
    document.querySelectorAll('.zone-dot').forEach((dot, i) => {
      if (i + 1 === this.currentZone) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Show message
    this.showMessage(this.getText('ZONE').replace('{zone}', config.name));
    
    // Speak
    audioManager.speakZone(zone);
    
    // Animate Tina
    this.animateTina('dance');
    
    // Start timer
    this.startTimer();
  }
  
  showCelebration() {
    document.getElementById('timer-container').classList.add('hidden');
    document.getElementById('zone-indicators').classList.add('hidden');
    
    this.showMessage(this.getText('CELEBRATION'));
    audioManager.speakCelebration();
    
    // Animate Tina - celebration
    this.animateTina('celebration');
    
    // Show confetti
    this.showConfetti();
    
    // Show restart button
    setTimeout(() => this.showRestartButton(), 2000);
  }
  
  startTimer() {
    this.timerSeconds = 30;
    this.updateTimerDisplay();
    
    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      this.updateTimerDisplay();
      
      if (this.timerSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.onZoneComplete();
      }
    }, 1000);
  }
  
  updateTimerDisplay() {
    const timerText = document.querySelector('.timer-text');
    const timerProgress = document.querySelector('.timer-progress');
    
    if (timerText) timerText.textContent = this.timerSeconds;
    
    if (timerProgress) {
      const progress = (30 - this.timerSeconds) / 30;
      const circumference = 2 * Math.PI * 54;
      timerProgress.style.strokeDashoffset = circumference * (1 - progress);
      
      // Color change
      if (this.timerSeconds > 10) {
        timerProgress.style.stroke = '#4CAF50';
      } else if (this.timerSeconds > 5) {
        timerProgress.style.stroke = '#FFC107';
      } else {
        timerProgress.style.stroke = '#F44336';
      }
    }
  }
  
  onZoneComplete() {
    if (this.currentZone < 4) {
      // Next zone
      this.stateMachine.nextZone();
    } else {
      // Celebration
      this.stateMachine.celebrate();
    }
  }
  
  onTimerTick(detail) {
    this.encouragementTimer++;
    if (this.encouragementTimer >= 10 && detail.seconds > 5) {
      this.encouragementTimer = 0;
      audioManager.speakEncouragement();
    }
  }
  
  onTimerComplete(detail) {
    console.log('Zone complete');
  }
  
  animateTina(animation) {
    if (!this.tinaModel) return;
    
    switch (animation) {
      case 'wave':
        // Gentle rotation for wave
        const waveTween = () => {
          this.tinaModel.rotation.y = Math.sin(Date.now() * 0.003) * 0.3;
          if (this.currentAnimation === 'wave') {
            requestAnimationFrame(waveTween);
          }
        };
        this.currentAnimation = 'wave';
        waveTween();
        break;
        
      case 'dance':
        // Bouncing dance
        this.currentAnimation = 'dance';
        break;
        
      case 'celebration':
        // Spin and jump
        this.currentAnimation = 'celebration';
        break;
        
      default:
        this.currentAnimation = 'idle';
    }
  }
  
  showConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FFB74D', '#4FC3F7'];
    const container = document.createElement('div');
    container.className = 'celebration-particles';
    container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 500;';
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: absolute; width: 12px; height: 12px; top: -20px; border-radius: 2px;
        left: ${Math.random() * 100}%; background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation: confetti-fall ${2 + Math.random() * 2}s linear forwards; animation-delay: ${Math.random() * 2}s;
      `;
      container.appendChild(confetti);
    }
    
    document.body.appendChild(container);
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => container.remove(), 5000);
  }
  
  showRestartButton() {
    const btn = document.createElement('button');
    btn.className = 'restart-btn';
    btn.textContent = this.currentLanguage === 'ES' ? '🔄 Jugar de nuevo' : 
                      this.currentLanguage === 'EN' ? '🔄 Play again' : '🔄 Jogar de novo';
    btn.style.cssText = `
      position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
      padding: 16px 32px; background: linear-gradient(135deg, #FFB74D 0%, #FF9800 100%);
      color: white; border: none; border-radius: 30px; font-size: 18px; font-weight: bold;
      cursor: pointer; z-index: 600; pointer-events: auto;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
    btn.onclick = () => location.reload();
    document.body.appendChild(btn);
  }
  
  showMessage(text) {
    const msgDisplay = document.getElementById('message-display');
    if (msgDisplay) {
      msgDisplay.textContent = text;
      msgDisplay.style.display = 'block';
    }
  }
  
  getText(key) {
    const texts = {
      ES: {
        INTRO: '¡Hola! Soy Tina. ¡Vamos a cepillarnos los dientes juntos!',
        ZONE: 'Ahora cepillemos la zona {zone}. ¡Recuerda inclinar el cepillo 45° y hacer círculos!',
        CELEBRATION: '¡Fantástico! ¡Has cepillado todos tus dientes como un campeón! 🎉'
      },
      EN: {
        INTRO: 'Hi! I\'m Tina. Let\'s brush our teeth together!',
        ZONE: 'Now let\'s brush the {zone} area. Remember to tilt the brush 45° and make circles!',
        CELEBRATION: 'Fantastic! You\'ve brushed all your teeth like a champion! 🎉'
      },
      PT: {
        INTRO: 'Olá! Sou Tina. Vamos escovar os dentes juntos!',
        ZONE: 'Agora vamos escovar a área {zone}. Lembre-se de inclinar a escova 45° e fazer círculos!',
        CELEBRATION: 'Fantástico! Você escovou todos os dentes como um campeão! 🎉'
      }
    };
    return texts[this.currentLanguage]?.[key] || texts.ES[key];
  }
  
  setLanguage(lang) {
    this.currentLanguage = lang;
    audioManager.setLanguage(LANGUAGES[lang]);
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }
  
  onResize() {
    const canvas = document.getElementById('tina-canvas');
    if (this.camera && this.renderer) {
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    const delta = this.clock.getDelta();
    
    // Update animation mixer
    if (this.mixer) {
      this.mixer.update(delta);
    }
    
    // Idle animation - gentle breathing
    if (this.tinaModel && this.currentAnimation !== 'wave') {
      this.tinaModel.position.y = Math.sin(Date.now() * 0.002) * 0.02;
    }
    
    // Render
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// Initialize
const app = new TinARSimple();
export default app;

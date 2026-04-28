// TinAR - UI Manager Module
// Manages all UI components: loading, timer, messages, overlays

import { STATES, ZONE_CONFIG } from './state-manager.js';
import { audioManager, LANGUAGES } from './audio-manager.js';

/**
 * UI Manager class
 * Handles all UI components with event-driven updates
 */
export class UIManager {
  constructor() {
    // UI element references
    this.loadingOverlay = null;
    this.uiOverlay = null;
    this.timerCircle = null;
    this.timerText = null;
    this.zoneLabel = null;
    this.messageDisplay = null;
    this.languageSelector = null;
    this.celebrationParticles = null;
    
    // State
    this.currentLanguage = 'ES';
    this.isInitialized = false;
    this.isCelebrationPlaying = false;
    
    // Bind methods
    this._onStateChange = this._onStateChange.bind(this);
    this._onTimerTick = this._onTimerTick.bind(this);
    this._onLanguageChange = this._onLanguageChange.bind(this);
    
    this._init();
  }
  
  /**
   * Initialize UI Manager
   */
  _init() {
    if (this.isInitialized) return;
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._setupUI());
    } else {
      this._setupUI();
    }
    
    this.isInitialized = true;
    console.log('🎨 UI Manager initialized');
  }
  
  /**
   * Setup UI elements and event bindings
   */
  _setupUI() {
    // Get references to existing elements
    this.loadingOverlay = document.getElementById('loading-overlay');
    this.uiOverlay = document.getElementById('ui-overlay');
    
    // Create UI elements if they don't exist
    this._createTimerElement();
    this._createMessageElement();
    this._createLanguageSelector();
    this._createCelebrationParticles();
    this._createEducationalOverlays();
    
    // Bind events
    this._bindEvents();
    
    // Set initial language from audio manager
    this.currentLanguage = audioManager.getLanguageCode();
    this._updateLanguageButtons();
  }
  
  /**
   * Create circular timer element
   */
  _createTimerElement() {
    if (document.getElementById('timer-container')) return;
    
    const container = document.createElement('div');
    container.id = 'timer-container';
    container.className = 'timer-container hidden';
    container.innerHTML = `
      <svg class="timer-svg" viewBox="0 0 120 120">
        <circle class="timer-bg" cx="60" cy="60" r="54" />
        <circle class="timer-progress" cx="60" cy="60" r="54" />
      </svg>
      <div class="timer-content">
        <div class="timer-text">30</div>
        <div class="timer-zone-label"></div>
      </div>
    `;
    
    this.uiOverlay.appendChild(container);
    this.timerCircle = container.querySelector('.timer-progress');
    this.timerText = container.querySelector('.timer-text');
    this.zoneLabel = container.querySelector('.timer-zone-label');
  }
  
  /**
   * Create message display element
   */
  _createMessageElement() {
    if (document.getElementById('message-display')) {
      this.messageDisplay = document.getElementById('message-display');
      return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.id = 'message-display';
    messageDiv.className = 'message-display';
    
    this.uiOverlay.appendChild(messageDiv);
    this.messageDisplay = messageDiv;
  }
  
  /**
   * Create language selector
   */
  _createLanguageSelector() {
    if (document.getElementById('language-selector')) {
      this.languageSelector = document.getElementById('language-selector');
      return;
    }
    
    const selector = document.createElement('div');
    selector.id = 'language-selector';
    selector.className = 'language-selector';
    selector.innerHTML = `
      <button class="lang-btn" data-lang="ES">ES</button>
      <button class="lang-btn" data-lang="EN">EN</button>
      <button class="lang-btn" data-lang="PT">PT</button>
    `;
    
    this.uiOverlay.appendChild(selector);
    this.languageSelector = selector;
    
    // Add click handlers
    selector.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.target.dataset.lang;
        this.setLanguage(lang);
      });
    });
  }
  
  /**
   * Create celebration particles container
   */
  _createCelebrationParticles() {
    if (document.getElementById('celebration-particles')) {
      this.celebrationParticles = document.getElementById('celebration-particles');
      return;
    }
    
    const container = document.createElement('div');
    container.id = 'celebration-particles';
    container.className = 'celebration-particles hidden';
    
    this.uiOverlay.appendChild(container);
    this.celebrationParticles = container;
  }
  
  /**
   * Create educational overlays (arrows, circles)
   */
  _createEducationalOverlays() {
    // Brush angle arrow (45°)
    if (!document.getElementById('brush-angle-arrow')) {
      const arrowOverlay = document.createElement('div');
      arrowOverlay.id = 'brush-angle-arrow';
      arrowOverlay.className = 'overlay-svg hidden';
      arrowOverlay.innerHTML = `
        <svg viewBox="0 0 100 100" width="80" height="80">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#FFB74D" />
            </marker>
          </defs>
          <line x1="10" y1="90" x2="80" y2="20" stroke="#FFB74D" stroke-width="4" marker-end="url(#arrowhead)" />
          <text x="50" y="50" text-anchor="middle" fill="white" font-size="12">45°</text>
        </svg>
      `;
      this.uiOverlay.appendChild(arrowOverlay);
    }
    
    // Circular motion indicator
    if (!document.getElementById('brushing-motion')) {
      const motionOverlay = document.createElement('div');
      motionOverlay.id = 'brushing-motion';
      motionOverlay.className = 'overlay-svg hidden';
      motionOverlay.innerHTML = `
        <svg viewBox="0 0 60 60" width="60" height="60">
          <circle cx="30" cy="30" r="25" fill="none" stroke="#4FC3F7" stroke-width="3" stroke-dasharray="40 120" />
          <polygon points="45,25 55,30 45,35" fill="#4FC3F7" />
        </svg>
      `;
      this.uiOverlay.appendChild(motionOverlay);
    }
    
    // Zone indicators
    if (!document.getElementById('zone-indicators')) {
      const zoneContainer = document.createElement('div');
      zoneContainer.id = 'zone-indicators';
      zoneContainer.className = 'zone-indicators hidden';
      zoneContainer.innerHTML = `
        <div class="zone-dot" data-zone="1"></div>
        <div class="zone-dot" data-zone="2"></div>
        <div class="zone-dot" data-zone="3"></div>
        <div class="zone-dot" data-zone="4"></div>
      `;
      this.uiOverlay.appendChild(zoneContainer);
    }
  }
  
  /**
   * Bind event listeners
   */
  _bindEvents() {
    // State change events
    document.addEventListener('stateChange', this._onStateChange);
    
    // Timer tick events
    document.addEventListener('timerTick', this._onTimerTick);
    
    // Language change events
    document.addEventListener('languageChange', this._onLanguageChange);
  }
  
  /**
   * Handle state change events
   */
  _onStateChange(event) {
    const { state, previousState } = event.detail;
    console.log(`🎨 UI: State changed to ${state}`);
    
    // Hide all overlays first
    this.hideAllOverlays();
    
    // Handle each state
    switch (state) {
      case STATES.LOADING:
        this.showLoading();
        break;
        
      case STATES.INTRO:
        this.hideLoading();
        this.hideTimer();
        this.showMessage(this._getText('INTRO'));
        break;
        
      case STATES.ZONE_1:
      case STATES.ZONE_2:
      case STATES.ZONE_3:
      case STATES.ZONE_4:
        this.showZoneUI(state);
        break;
        
      case STATES.CELEBRATION:
        this.showCelebrationUI();
        break;
    }
  }
  
  /**
   * Handle timer tick events
   */
  _onTimerTick(event) {
    const { remaining, duration, progress, seconds } = event.detail;
    
    if (this.timerText) {
      this.timerText.textContent = seconds;
    }
    
    // Update circular progress
    this._updateTimerProgress(progress);
    
    // Update timer color based on time remaining
    this._updateTimerColor(seconds);
  }
  
  /**
   * Handle language change events
   */
  _onLanguageChange(event) {
    this.currentLanguage = audioManager.getLanguageCode();
    this._updateLanguageButtons();
  }
  
  /**
   * Show loading overlay
   */
  showLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.style.display = 'flex';
      this.loadingOverlay.style.opacity = '1';
    }
  }
  
  /**
   * Hide loading overlay with fade transition
   */
  hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.style.opacity = '0';
      this.loadingOverlay.style.transition = 'opacity 0.5s ease';
      
      setTimeout(() => {
        this.loadingOverlay.style.display = 'none';
      }, 500);
    }
  }
  
  /**
   * Show zone UI (timer, overlays)
   */
  showZoneUI(zone) {
    const config = ZONE_CONFIG[zone];
    
    // Show timer
    this.showTimer(config);
    
    // Show educational overlays
    this.showEducationalOverlays(zone);
    
    // Show zone message
    const zoneName = this.currentLanguage === 'ES' ? config.name : 
                     this.currentLanguage === 'EN' ? config.nameEn : config.name;
    this.showMessage(this._getText('ZONE').replace('{zone}', zoneName));
    
    // Highlight current zone
    this._highlightZone(zone);
  }
  
  /**
   * Show timer with zone config
   */
  showTimer(config) {
    const container = document.getElementById('timer-container');
    if (container) {
      container.classList.remove('hidden');
      
      // Set zone label
      if (this.zoneLabel) {
        const zoneName = this.currentLanguage === 'ES' ? config.name : 
                         this.currentLanguage === 'EN' ? config.nameEn : config.name;
        this.zoneLabel.textContent = zoneName;
      }
      
      // Reset progress to full
      this._updateTimerProgress(0);
      this._updateTimerColor(30);
    }
  }
  
  /**
   * Hide timer
   */
  hideTimer() {
    const container = document.getElementById('timer-container');
    if (container) {
      container.classList.add('hidden');
    }
  }
  
  /**
   * Update timer progress (0-1)
   */
  _updateTimerProgress(progress) {
    if (this.timerCircle) {
      const circumference = 2 * Math.PI * 54; // r=54
      const dashOffset = circumference * (1 - progress);
      this.timerCircle.style.strokeDashoffset = dashOffset;
    }
  }
  
  /**
   * Update timer color based on remaining seconds
   */
  _updateTimerColor(seconds) {
    if (this.timerCircle) {
      let color;
      if (seconds > 10) {
        color = '#4CAF50'; // Green
      } else if (seconds > 5) {
        color = '#FFC107'; // Yellow
      } else {
        color = '#F44336'; // Red
      }
      this.timerCircle.style.stroke = color;
    }
  }
  
  /**
   * Show educational overlays for a zone
   */
  showEducationalOverlays(zone) {
    // Show brush angle arrow
    const arrow = document.getElementById('brush-angle-arrow');
    if (arrow) {
      arrow.classList.remove('hidden');
      this._positionArrowForZone(arrow, zone);
    }
    
    // Show circular motion indicator
    const motion = document.getElementById('brushing-motion');
    if (motion) {
      motion.classList.remove('hidden');
      this._positionMotionForZone(motion, zone);
    }
    
    // Show zone indicators
    const zoneIndicators = document.getElementById('zone-indicators');
    if (zoneIndicators) {
      zoneIndicators.classList.remove('hidden');
    }
  }
  
  /**
   * Position arrow overlay for zone
   */
  _positionArrowForZone(arrow, zone) {
    // Position based on zone quadrant
    const positions = {
      [STATES.ZONE_1]: { top: '20%', right: '20%' },   // Upper right
      [STATES.ZONE_2]: { top: '20%', left: '20%' },    // Upper left
      [STATES.ZONE_3]: { bottom: '20%', right: '20%' }, // Lower right
      [STATES.ZONE_4]: { bottom: '20%', left: '20%' }   // Lower left
    };
    
    const pos = positions[zone];
    if (pos) {
      arrow.style.top = pos.top || 'auto';
      arrow.style.bottom = pos.bottom || 'auto';
      arrow.style.left = pos.left || 'auto';
      arrow.style.right = pos.right || 'auto';
    }
  }
  
  /**
   * Position motion indicator for zone
   */
  _positionMotionForZone(motion, zone) {
    // Slightly offset from arrow
    const positions = {
      [STATES.ZONE_1]: { top: '25%', right: '30%' },
      [STATES.ZONE_2]: { top: '25%', left: '30%' },
      [STATES.ZONE_3]: { bottom: '25%', right: '30%' },
      [STATES.ZONE_4]: { bottom: '25%', left: '30%' }
    };
    
    const pos = positions[zone];
    if (pos) {
      motion.style.top = pos.top || 'auto';
      motion.style.bottom = pos.bottom || 'auto';
      motion.style.left = pos.left || 'auto';
      motion.style.right = pos.right || 'auto';
    }
  }
  
  /**
   * Highlight current zone in zone indicators
   */
  _highlightZone(zone) {
    const zoneNum = zone.split('_')[1];
    const indicators = document.querySelectorAll('.zone-dot');
    
    indicators.forEach((dot, index) => {
      if (index + 1 === parseInt(zoneNum)) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  /**
   * Hide all educational overlays
   */
  hideAllOverlays() {
    const arrow = document.getElementById('brush-angle-arrow');
    const motion = document.getElementById('brushing-motion');
    const zoneIndicators = document.getElementById('zone-indicators');
    
    if (arrow) arrow.classList.add('hidden');
    if (motion) motion.classList.add('hidden');
    if (zoneIndicators) zoneIndicators.classList.add('hidden');
    
    // Remove active class from all zone dots
    document.querySelectorAll('.zone-dot').forEach(dot => {
      dot.classList.remove('active');
    });
  }
  
  /**
   * Show celebration UI
   */
  showCelebrationUI() {
    this.hideTimer();
    this.hideAllOverlays();
    this.showMessage(this._getText('CELEBRATION'));
    this.showCelebrationParticles();
  }
  
  /**
   * Show celebration particles
   */
  showCelebrationParticles() {
    if (this.isCelebrationPlaying) return;
    this.isCelebrationPlaying = true;
    
    const container = this.celebrationParticles;
    if (!container) return;
    
    container.classList.remove('hidden');
    container.innerHTML = ''; // Clear previous particles
    
    // Create confetti pieces
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FFB74D', '#4FC3F7'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
      container.appendChild(confetti);
    }
    
    // Create stars
    for (let i = 0; i < 15; i++) {
      const star = document.createElement('div');
      star.className = 'star-particle';
      star.style.left = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 1 + 's';
      container.appendChild(star);
    }
    
    // Create "¡Muy bien!" text particles
    const texts = ['¡Muy bien!', '⭐', '✨', '🌟'];
    for (let i = 0; i < 8; i++) {
      const textParticle = document.createElement('div');
      textParticle.className = 'text-particle';
      textParticle.textContent = texts[Math.floor(Math.random() * texts.length)];
      textParticle.style.left = Math.random() * 100 + '%';
      textParticle.style.animationDelay = Math.random() * 3 + 's';
      container.appendChild(textParticle);
    }
    
    // Hide after 5 seconds
    setTimeout(() => {
      container.classList.add('hidden');
      this.isCelebrationPlaying = false;
    }, 5000);
  }
  
  /**
   * Hide celebration particles
   */
  hideCelebrationParticles() {
    if (this.celebrationParticles) {
      this.celebrationParticles.classList.add('hidden');
      this.celebrationParticles.innerHTML = '';
    }
    this.isCelebrationPlaying = false;
  }
  
  /**
   * Show message
   */
  showMessage(text) {
    if (this.messageDisplay) {
      this.messageDisplay.textContent = text;
      this.messageDisplay.style.opacity = '1';
      this.messageDisplay.classList.remove('hidden');
    }
  }
  
  /**
   * Hide message
   */
  hideMessage() {
    if (this.messageDisplay) {
      this.messageDisplay.style.opacity = '0';
      setTimeout(() => {
        this.messageDisplay.classList.add('hidden');
      }, 300);
    }
  }
  
  /**
   * Set language
   */
  setLanguage(lang) {
    const langCode = LANGUAGES[lang];
    if (langCode) {
      audioManager.setLanguage(langCode);
      this.currentLanguage = lang;
      this._updateLanguageButtons();
    }
  }
  
  /**
   * Update language button states
   */
  _updateLanguageButtons() {
    if (!this.languageSelector) return;
    
    this.languageSelector.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.dataset.lang === this.currentLanguage) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  /**
   * Get localized text
   */
  _getText(key) {
    const texts = {
      ES: {
        INTRO: '¡Hola! Soy Tina, tu amiga diente. ¡Vamos a cepillarnos juntos!',
        ZONE: 'Ahora cepillemos la zona {zone}. Recuerda inclinar el cepillo 45° y hacer círculos pequeños.',
        CELEBRATION: '¡Fantástico! ¡Has cepillado todos tus dientes como un campeón! 🎉',
        TARGET_LOST: 'Apunta la cámara al marcador para continuar.'
      },
      EN: {
        INTRO: 'Hi! I\'m Tina, your tooth friend. Let\'s brush together!',
        ZONE: 'Now let\'s brush the {zone} area. Remember to tilt the brush 45° and make small circles.',
        CELEBRATION: 'Fantastic! You\'ve brushed all your teeth like a champion! 🎉',
        TARGET_LOST: 'Point the camera at the marker to continue.'
      },
      PT: {
        INTRO: 'Olá! Sou Tina, sua amiga dente. Vamos escovar juntos!',
        ZONE: 'Agora vamos escovar a área {zone}. Lembre-se de inclinar a escova 45° e fazer círculos pequenos.',
        CELEBRATION: 'Fantástico! Você escovou todos os dentes como um campeão! 🎉',
        TARGET_LOST: 'Aponte a câmera para o marcador para continuar.'
      }
    };
    
    return texts[this.currentLanguage]?.[key] || texts.ES[key] || '';
  }
  
  /**
   * Show target lost message
   */
  showTargetLost() {
    this.showMessage(this._getText('TARGET_LOST'));
  }
  
  /**
   * Get current language
   */
  getLanguage() {
    return this.currentLanguage;
  }
}

// Create singleton instance
export const uiManager = new UIManager();

// Default export
export default uiManager;

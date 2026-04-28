// TinAR - Audio Manager Module
// Web Speech API TTS with ES/EN/PT language support
// Educational content for dental brushing guidance

// Language constants
export const LANGUAGES = {
  ES: 'es-ES',
  EN: 'en-US',
  PT: 'pt-BR'
};

// Zone name translations
export const ZONE_NAMES = {
  ES: {
    ZONE_1: 'superior derecho',
    ZONE_2: 'superior izquierdo',
    ZONE_3: 'inferior derecho',
    ZONE_4: 'inferior izquierdo'
  },
  EN: {
    ZONE_1: 'right upper',
    ZONE_2: 'left upper',
    ZONE_3: 'right lower',
    ZONE_4: 'left lower'
  },
  PT: {
    ZONE_1: 'superior direito',
    ZONE_2: 'superior esquerdo',
    ZONE_3: 'inferior direito',
    ZONE_4: 'inferior esquerdo'
  }
};

// Educational dialog dictionaries
export const DIALOGS = {
  ES: {
    INTRO: '¡Hola! Soy Tina la dinosauria. ¡Vamos a cepillar tus dientes juntos!',
    ZONE: 'Ahora cepillemos la zona {zone}. Recuerda inclinar el cepillo 45 grados y hacer círculos pequeños.',
    CELEBRATION: '¡Fantástico! ¡Has cepillado todos tus dientes como un campeón!',
    TARGET_LOST: 'Apunta la cámara al marcador para continuar.',
    ENCOURAGEMENT: [
      '¡Muy bien! ¡Sigue así!',
      '¡Excelente trabajo!',
      '¡Qué bien lo estás haciendo!',
      '¡Eres un campeón cepillando!'
    ]
  },
  EN: {
    INTRO: 'Hi! I\'m Tina the dinosaur. Let\'s brush your teeth together!',
    ZONE: 'Now let\'s brush the {zone} area. Remember to tilt the brush 45 degrees and make small circles.',
    CELEBRATION: 'Fantastic! You\'ve brushed all your teeth like a champion!',
    TARGET_LOST: 'Point the camera at the marker to continue.',
    ENCOURAGEMENT: [
      'Great job! Keep going!',
      'Excellent work!',
      'You\'re doing great!',
      'You\'re a brushing champion!'
    ]
  },
  PT: {
    INTRO: 'Olá! Sou Tina a dinossauro. Vamos escovar seus dentes juntos!',
    ZONE: 'Agora vamos escovar a área {zone}. Lembre-se de inclinar a escova 45 graus e fazer círculos pequenos.',
    CELEBRATION: 'Fantástico! Você escovou todos os dentes como um campeão!',
    TARGET_LOST: 'Aponte a câmera para o marcador para continuar.',
    ENCOURAGEMENT: [
      'Muito bem! Continue assim!',
      'Excelente trabalho!',
      'Você está indo muito bem!',
      'Você é um campeão da escovação!'
    ]
  }
};

// Audio Manager class
export class AudioManager {
  constructor() {
    this.synth = null;
    this.currentLanguage = LANGUAGES.ES;
    this.currentVoice = null;
    this.isEnabled = true;
    this.rate = 0.9; // Slightly slower for children
    this.pitch = 1.1; // Slightly higher pitch, more friendly
    this.volume = 1.0;
    this.queue = [];
    this.isSpeaking = false;
    this.voices = [];
    this.voicesLoaded = false;
    
    this._init();
  }
  
  _init() {
    // Check browser support
    if (!('speechSynthesis' in window)) {
      console.warn('⚠️ Web Speech API not supported in this browser');
      this.isEnabled = false;
      return;
    }
    
    this.synth = window.speechSynthesis;
    
    // Load voices (async in some browsers)
    this._loadVoices();
    
    // Chrome requires waiting for voiceschanged event
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this._loadVoices();
    }
    
    // Auto-detect browser language
    this._detectBrowserLanguage();
    
    console.log('🔊 AudioManager initialized');
  }
  
  _loadVoices() {
    this.voices = this.synth.getVoices();
    this.voicesLoaded = true;
    this._selectBestVoice();
    console.log(`🎙️ Loaded ${this.voices.length} voices`);
  }
  
  _detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    
    // Map browser language to our supported languages
    if (browserLang.startsWith('es')) {
      this.currentLanguage = LANGUAGES.ES;
    } else if (browserLang.startsWith('en')) {
      this.currentLanguage = LANGUAGES.EN;
    } else if (browserLang.startsWith('pt')) {
      this.currentLanguage = LANGUAGES.PT;
    } else {
      // Default to Spanish for Latin America
      this.currentLanguage = LANGUAGES.ES;
    }
    
    console.log(`🌍 Detected browser language: ${browserLang} → Using: ${this.currentLanguage}`);
  }
  
  _selectBestVoice() {
    if (!this.voicesLoaded || this.voices.length === 0) return;
    
    // Priority: native voice for current language, then any voice for that language
    const langPrefix = this.currentLanguage.split('-')[0];
    
    // Try to find a female voice for the language (Tina is female)
    let voice = this.voices.find(v => 
      v.lang.startsWith(langPrefix) && 
      v.name.toLowerCase().includes('female')
    );
    
    // Fallback to any voice for the language
    if (!voice) {
      voice = this.voices.find(v => v.lang.startsWith(langPrefix));
    }
    
    // Final fallback to default voice
    if (!voice && this.voices.length > 0) {
      voice = this.voices[0];
    }
    
    this.currentVoice = voice;
    if (voice) {
      console.log(`🎤 Selected voice: ${voice.name} (${voice.lang})`);
    }
  }
  
  setLanguage(langCode) {
    // Validate language code
    const validLangs = Object.values(LANGUAGES);
    if (!validLangs.includes(langCode)) {
      console.error(`Invalid language code: ${langCode}`);
      return false;
    }
    
    this.currentLanguage = langCode;
    this._selectBestVoice();
    
    // Emit language change event
    const event = new CustomEvent('languageChange', {
      detail: { language: langCode }
    });
    document.dispatchEvent(event);
    
    console.log(`🌐 Language set to: ${langCode}`);
    return true;
  }
  
  getLanguage() {
    return this.currentLanguage;
  }
  
  getLanguageCode() {
    // Return simple language code (es, en, pt)
    return this.currentLanguage.split('-')[0].toUpperCase();
  }
  
  speak(text, options = {}) {
    if (!this.isEnabled || !this.synth) {
      console.log(`🔇 Audio disabled, would say: "${text}"`);
      return null;
    }
    
    // Cancel any current speech
    this.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure utterance
    utterance.lang = options.lang || this.currentLanguage;
    utterance.rate = options.rate || this.rate;
    utterance.pitch = options.pitch || this.pitch;
    utterance.volume = options.volume || this.volume;
    
    if (this.currentVoice) {
      utterance.voice = this.currentVoice;
    }
    
    // Event handlers
    utterance.onstart = () => {
      this.isSpeaking = true;
      console.log(`🗣️ Speaking: "${text.substring(0, 50)}..."`);
    };
    
    utterance.onend = () => {
      this.isSpeaking = false;
      this._processQueue();
    };
    
    utterance.onerror = (event) => {
      this.isSpeaking = false;
      console.error('Speech error:', event.error);
      this._processQueue();
    };
    
    // Speak immediately (queue managed by browser)
    this.synth.speak(utterance);
    
    return utterance;
  }
  
  speakDialog(dialogKey, replacements = {}) {
    const langCode = this.getLanguageCode();
    let text = DIALOGS[langCode][dialogKey];
    
    // Apply replacements (e.g., {zone} -> zone name)
    for (const [key, value] of Object.entries(replacements)) {
      text = text.replace(`{${key}}`, value);
    }
    
    return this.speak(text);
  }
  
  speakZone(zone) {
    const langCode = this.getLanguageCode();
    const zoneName = ZONE_NAMES[langCode][zone];
    return this.speakDialog('ZONE', { zone: zoneName });
  }
  
  speakIntro() {
    return this.speakDialog('INTRO');
  }
  
  speakCelebration() {
    return this.speakDialog('CELEBRATION');
  }
  
  speakEncouragement() {
    const langCode = this.getLanguageCode();
    const encouragements = DIALOGS[langCode].ENCOURAGEMENT;
    const randomIndex = Math.floor(Math.random() * encouragements.length);
    return this.speak(encouragements[randomIndex]);
  }
  
  speakTargetLost() {
    return this.speakDialog('TARGET_LOST');
  }
  
  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.queue = [];
    }
  }
  
  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }
  
  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }
  
  toggle() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.stop();
    }
    return this.isEnabled;
  }
  
  _processQueue() {
    if (this.queue.length > 0 && !this.isSpeaking) {
      const next = this.queue.shift();
      this.speak(next.text, next.options);
    }
  }
  
  queueSpeech(text, options = {}) {
    this.queue.push({ text, options });
    if (!this.isSpeaking) {
      this._processQueue();
    }
  }
  
  isSupported() {
    return this.isEnabled && 'speechSynthesis' in window;
  }
  
  getAvailableVoices() {
    return this.voices.map(v => ({
      name: v.name,
      lang: v.lang,
      default: v.default
    }));
  }
}

// Create singleton instance
export const audioManager = new AudioManager();

// Default export
export default audioManager;

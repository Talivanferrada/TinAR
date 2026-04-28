---
phase: 04-audio
plan: 01
type: implementation
autonomous: true
wave: 1
depends_on: [03-states-01]

requirements: [AUDIO-01, AUDIO-02, AUDIO-03, AUDIO-04]

objective: Implement audio-manager.js module with Web Speech API TTS and multi-language support (ES/EN/PT)

context:
  - "@.planning/STATE.md"
  - "@src/state-manager.js"
  - "@src/app.js"

tasks:
  - id: T1
    type: auto
    name: Create audio-manager.js module
    behavior: |
      Create src/audio-manager.js as ES6 module with:
      - Web Speech API (SpeechSynthesis) integration
      - Browser compatibility check
      - Voice loading and selection
      - Auto-detect browser language
    implementation: |
      Export LANGUAGES constant (ES, EN, PT)
      Export ZONE_NAMES translations for each language
      Export DIALOGS dictionary with all educational content
      Export AudioManager class with:
        - constructor: Initialize synth, voices, language
        - _init(): Check browser support, load voices
        - _loadVoices(): Get available voices from browser
        - _detectBrowserLanguage(): Auto-detect from navigator.language
        - _selectBestVoice(): Select best voice for current language
        - setLanguage(langCode): Manual language selection
        - getLanguage(): Return current language
        - speak(text, options): Core TTS method
        - speakDialog(key, replacements): Speak from dictionary
        - speakZone(zone): Speak zone-specific content
        - speakIntro(), speakCelebration(), speakEncouragement()
        - stop(), pause(), resume(), toggle()
      Export singleton audioManager instance
    done_criteria:
      - audio-manager.js created as ES6 module
      - Browser compatibility check works
      - Voice loading works
      - Auto-detection of browser language implemented
    commit: feat(04-audio-01): create audio-manager.js with TTS and language support

  - id: T2
    type: auto
    name: Add educational dialog dictionaries
    behavior: |
      Implement complete educational content for all states in all 3 languages
    implementation: |
      DIALOGS object with ES, EN, PT:
        INTRO: Welcome message
        ZONE: Educational content about 45° angle and circular motion
        CELEBRATION: Congratulations message
        TARGET_LOST: Prompt to find marker
        ENCOURAGEMENT: Array of 4 encouraging phrases
      
      ZONE_NAMES for each language:
        ZONE_1: superior derecho / right upper / superior direito
        ZONE_2: superior izquierdo / left upper / superior esquerdo
        ZONE_3: inferior derecho / right lower / inferior direito
        ZONE_4: inferior izquierdo / left lower / inferior esquerdo
    done_criteria:
      - All dialogs present in ES, EN, PT
      - Zone names correctly translated
      - Educational content mentions 45° angle and circular motion
    commit: included in T1 (part of audio-manager.js)

  - id: T3
    type: auto
    name: Integrate audio-manager with app.js
    behavior: |
      Update app.js to import and use audio-manager for all state transitions
    implementation: |
      Import audioManager and LANGUAGES from audio-manager.js
      Update constructor to add encouragementTimer and encouragementInterval
      Update _onTimerTick() to speak encouragement every 10 seconds
      Update showIntro() to call audioManager.speakIntro()
      Update showZone() to call audioManager.speakZone(zone)
      Update showCelebration() to call audioManager.speakCelebration()
      Update targetLost handler to call audioManager.speakTargetLost()
      Add setLanguage(), getLanguage(), toggleAudio() methods
      Add speakEncouragement() method
    done_criteria:
      - app.js imports audio-manager
      - Audio plays on all state transitions
      - Encouragement plays during brushing
      - Language selection methods available
    commit: feat(04-audio-01): integrate audio-manager with app.js

verification:
  - Check audio-manager.js exports LANGUAGES, ZONE_NAMES, DIALOGS, AudioManager, audioManager
  - Check app.js imports and uses audioManager
  - Verify all dialogs present in all 3 languages
  - Verify TTS methods exist for all states

success_criteria:
  - Web Speech API integrated
  - 3 languages (ES/EN/PT) working
  - Auto-detection of browser language
  - Manual language selector available
  - Educational content for all states

output:
  files:
    created: [src/audio-manager.js]
    modified: [src/app.js]
  exports:
    - LANGUAGES
    - ZONE_NAMES
    - DIALOGS
    - AudioManager class
    - audioManager singleton

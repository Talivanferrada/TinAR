// TinAR - State Manager Module
// Controls the flow: LOADING → INTRO → ZONES → CELEBRATION

// State constants
export const STATES = {
  LOADING: 'LOADING',
  INTRO: 'INTRO',
  ZONE_1: 'ZONE_1',    // Superior derecho (right upper)
  ZONE_2: 'ZONE_2',    // Superior izquierdo (left upper)
  ZONE_3: 'ZONE_3',    // Inferior derecho (right lower)
  ZONE_4: 'ZONE_4',    // Inferior izquierdo (left lower)
  CELEBRATION: 'CELEBRATION'
};

// Zone configuration (ADA guidelines)
export const ZONE_CONFIG = {
  ZONE_1: { name: 'Superior derecho', nameEn: 'Right upper', duration: 30000 },
  ZONE_2: { name: 'Superior izquierdo', nameEn: 'Left upper', duration: 30000 },
  ZONE_3: { name: 'Inferior derecho', nameEn: 'Right lower', duration: 30000 },
  ZONE_4: { name: 'Inferior izquierdo', nameEn: 'Left lower', duration: 30000 }
};

// Timer class with pause/resume capability
export class Timer {
  constructor() {
    this.duration = 0;
    this.remaining = 0;
    this.intervalId = null;
    this.isRunning = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedAt = null;
  }

  start(duration) {
    this.duration = duration;
    this.remaining = duration;
    this.isRunning = true;
    this.isPaused = false;
    this.startTime = Date.now();
    
    this._emitTick();
    
    this.intervalId = setInterval(() => {
      if (this.isPaused) return;
      
      const elapsed = Date.now() - this.startTime;
      this.remaining = Math.max(0, this.duration - elapsed);
      
      this._emitTick();
      
      if (this.remaining <= 0) {
        this.complete();
      }
    }, 1000);
  }

  pause() {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
    this.pausedAt = Date.now();
    clearInterval(this.intervalId);
  }

  resume() {
    if (!this.isRunning || !this.isPaused) return;
    
    // Adjust start time to account for pause duration
    const pauseDuration = Date.now() - this.pausedAt;
    this.startTime += pauseDuration;
    this.isPaused = false;
    
    // Restart interval
    this.intervalId = setInterval(() => {
      if (this.isPaused) return;
      
      const elapsed = Date.now() - this.startTime;
      this.remaining = Math.max(0, this.duration - elapsed);
      
      this._emitTick();
      
      if (this.remaining <= 0) {
        this.complete();
      }
    }, 1000);
  }

  reset() {
    clearInterval(this.intervalId);
    this.duration = 0;
    this.remaining = 0;
    this.intervalId = null;
    this.isRunning = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedAt = null;
  }

  complete() {
    clearInterval(this.intervalId);
    this.isRunning = false;
    this.remaining = 0;
    
    const event = new CustomEvent('timerComplete', {
      detail: { timer: this }
    });
    document.dispatchEvent(event);
  }

  _emitTick() {
    const event = new CustomEvent('timerTick', {
      detail: {
        remaining: this.remaining,
        duration: this.duration,
        progress: 1 - (this.remaining / this.duration),
        seconds: Math.ceil(this.remaining / 1000)
      }
    });
    document.dispatchEvent(event);
  }
}

// State Machine class
export class StateMachine {
  constructor() {
    this.currentState = STATES.LOADING;
    this.previousState = null;
    this.timer = new Timer;
    this.history = [];
    this.zonesCompleted = [];
    
    this._bindTimerEvents();
  }

  _bindTimerEvents() {
    document.addEventListener('timerComplete', (event) => {
      this._onTimerComplete(event);
    });
  }

  _onTimerComplete(event) {
    // Auto-advance to next zone when timer completes
    if (this._isZoneState(this.currentState)) {
      this.nextZone();
    }
  }

  _isZoneState(state) {
    return [STATES.ZONE_1, STATES.ZONE_2, STATES.ZONE_3, STATES.ZONE_4].includes(state);
  }

  _emitStateChange(newState, previousState) {
    const event = new CustomEvent('stateChange', {
      detail: {
        state: newState,
        previousState: previousState,
        timestamp: Date.now(),
        zonesCompleted: [...this.zonesCompleted]
      }
    });
    document.dispatchEvent(event);
    console.log(`🔄 State changed: ${previousState} → ${newState}`);
  }

  transition(newState) {
    if (!Object.values(STATES).includes(newState)) {
      console.error(`Invalid state: ${newState}`);
      return false;
    }

    // Validate transition
    if (!this._isValidTransition(newState)) {
      console.warn(`Invalid transition: ${this.currentState} → ${newState}`);
      return false;
    }

    // Stop current timer if running
    this.timer.reset();

    // Update state
    this.previousState = this.currentState;
    this.currentState = newState;
    this.history.push({ state: newState, timestamp: Date.now() });

    // Track completed zones
    if (this._isZoneState(this.previousState)) {
      this.zonesCompleted.push(this.previousState);
    }

    // Start timer for zone states
    if (this._isZoneState(newState)) {
      const config = ZONE_CONFIG[newState];
      this.timer.start(config.duration);
    }

    // Emit state change event
    this._emitStateChange(newState, this.previousState);

    return true;
  }

  _isValidTransition(newState) {
    const validTransitions = {
      [STATES.LOADING]: [STATES.INTRO],
      [STATES.INTRO]: [STATES.ZONE_1, STATES.LOADING],
      [STATES.ZONE_1]: [STATES.ZONE_2, STATES.INTRO],
      [STATES.ZONE_2]: [STATES.ZONE_3, STATES.ZONE_1],
      [STATES.ZONE_3]: [STATES.ZONE_4, STATES.ZONE_2],
      [STATES.ZONE_4]: [STATES.CELEBRATION, STATES.ZONE_3],
      [STATES.CELEBRATION]: [STATES.INTRO] // Restart
    };

    return validTransitions[this.currentState]?.includes(newState) ?? false;
  }

  nextZone() {
    const zoneOrder = [STATES.ZONE_1, STATES.ZONE_2, STATES.ZONE_3, STATES.ZONE_4];
    const currentIndex = zoneOrder.indexOf(this.currentState);
    
    if (currentIndex === -1) return false;
    
    if (currentIndex < zoneOrder.length - 1) {
      return this.transition(zoneOrder[currentIndex + 1]);
    } else {
      return this.transition(STATES.CELEBRATION);
    }
  }

  previousZone() {
    const zoneOrder = [STATES.ZONE_1, STATES.ZONE_2, STATES.ZONE_3, STATES.ZONE_4];
    const currentIndex = zoneOrder.indexOf(this.currentState);
    
    if (currentIndex > 0) {
      return this.transition(zoneOrder[currentIndex - 1]);
    }
    return false;
  }

  startIntro() {
    if (this.currentState === STATES.LOADING) {
      return this.transition(STATES.INTRO);
    }
    return false;
  }

  startBrushing() {
    if (this.currentState === STATES.INTRO) {
      return this.transition(STATES.ZONE_1);
    }
    return false;
  }

  restart() {
    this.timer.reset();
    this.zonesCompleted = [];
    this.history = [];
    this.currentState = STATES.INTRO;
    this.previousState = STATES.CELEBRATION;
    this._emitStateChange(STATES.INTRO, STATES.CELEBRATION);
    return true;
  }

  pause() {
    if (this._isZoneState(this.currentState) && this.timer.isRunning) {
      this.timer.pause();
      console.log('⏸️ Timer paused');
    }
  }

  resume() {
    if (this._isZoneState(this.currentState) && this.timer.isPaused) {
      this.timer.resume();
      console.log('▶️ Timer resumed');
    }
  }

  getStateInfo() {
    return {
      current: this.currentState,
      previous: this.previousState,
      isZone: this._isZoneState(this.currentState),
      zonesCompleted: [...this.zonesCompleted],
      timer: {
        isRunning: this.timer.isRunning,
        isPaused: this.timer.isPaused,
        remaining: this.timer.remaining,
        duration: this.timer.duration,
        seconds: Math.ceil(this.timer.remaining / 1000)
      }
    };
  }
}

// Create singleton instance
export const stateMachine = new StateMachine();

// Default export
export default stateMachine;

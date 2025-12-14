class AudioController {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Attempt to restore preference
    try {
      const saved = localStorage.getItem('anointed_sound_enabled');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
    } catch (e) {
      console.warn("Storage access failed", e);
    }
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    localStorage.setItem('anointed_sound_enabled', String(val));
    if (val) this.init();
  }

  public getEnabled() {
    return this.enabled;
  }

  public playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // Create a short, high-pitched "tick" or "pop"
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    // Swift frequency ramp for a "glassy" tap
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.05);

    // Short envelope
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playHover() {
     // Very subtle tick
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  }

  public playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // A regal major chord arpeggio (harp-like)
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major: C5, E5, G5, C6
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc.type = 'triangle'; // Softer than square, richer than sine
        osc.frequency.value = freq;
        
        const startTime = now + (i * 0.08); // Staggered
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
        
        osc.start(startTime);
        osc.stop(startTime + 0.8);
    });
  }

  public playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // A low, dissonant "thud" or "buzz"
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc1.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.3);

    // Slightly detuned second oscillator for dissonance
    osc2.frequency.setValueAtTime(145, this.ctx.currentTime); 
    osc2.frequency.linearRampToValueAtTime(95, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.3);
    osc2.stop(this.ctx.currentTime + 0.3);
  }

  public playTransition() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    
    // A soft swell (reverse cymbal effect approximation)
    const bufferSize = this.ctx.sampleRate * 1.5; // 1.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // White noise
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const gain = this.ctx.createGain();
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    
    // Fade in and out
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.5);
    gain.gain.linearRampToValueAtTime(0, now + 1.0);

    noise.start();
    noise.stop(now + 1.5);
  }
}

export const audio = new AudioController();

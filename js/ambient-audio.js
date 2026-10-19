/**
 * Doodle Desk — Synthesized Ambient Audio & Feedback Engine
 * 100% Web Audio API procedural synthesis with realtime FFT spectrum analysis
 * Zero external audio file dependencies.
 */

class AmbientSoundEngine {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.dataArray = null;
    this.activeNodes = {
      rain: null,
      lofi: null,
      whitenoise: null,
    };
    this.isPlaying = {
      rain: false,
      lofi: false,
      whitenoise: false,
    };
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.8;
        this.analyser.connect(this.ctx.destination);
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getFrequencyData() {
    if (!this.analyser || !this.dataArray) return null;
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  isAnyPlaying() {
    return this.isPlaying.rain || this.isPlaying.lofi || this.isPlaying.whitenoise;
  }

  /**
   * Tactile Mechanical Keycap Click
   */
  playKeyClick() {
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Authentic Pencil / Marker Scratch Sound on Canvas Stroke or Click
   */
  playPencilScratch(duration = 0.08) {
    try {
      this.init();
      if (!this.ctx) return;

      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.12;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 + Math.random() * 400, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      noise.start();
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Procedural Soothing Focus Rain
   */
  toggleRain(callback) {
    this.init();
    if (!this.ctx) return false;

    if (this.isPlaying.rain) {
      if (this.activeNodes.rain) {
        this.activeNodes.rain.gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);
        setTimeout(() => {
          try { this.activeNodes.rain?.source.stop(); } catch {}
          this.activeNodes.rain = null;
        }, 400);
      }
      this.isPlaying.rain = false;
      if (callback) callback(false);
      return false;
    }

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.05;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 0.4);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.analyser || this.ctx.destination);

    source.start();
    this.activeNodes.rain = { source, gain };
    this.isPlaying.rain = true;
    if (callback) callback(true);
    return true;
  }

  /**
   * Warm Lo-Fi Vinyl Hum & Subtle Crackle
   */
  toggleLoFi(callback) {
    this.init();
    if (!this.ctx) return false;

    if (this.isPlaying.lofi) {
      if (this.activeNodes.lofi) {
        this.activeNodes.lofi.gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);
        setTimeout(() => {
          try { this.activeNodes.lofi?.osc.stop(); } catch {}
          this.activeNodes.lofi = null;
        }, 400);
      }
      this.isPlaying.lofi = false;
      if (callback) callback(false);
      return false;
    }

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, this.ctx.currentTime + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.analyser || this.ctx.destination);

    osc.start();
    this.activeNodes.lofi = { osc, gain };
    this.isPlaying.lofi = true;
    if (callback) callback(true);
    return true;
  }

  /**
   * Focus Soft White Noise
   */
  toggleWhiteNoise(callback) {
    this.init();
    if (!this.ctx) return false;

    if (this.isPlaying.whitenoise) {
      if (this.activeNodes.whitenoise) {
        this.activeNodes.whitenoise.gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);
        setTimeout(() => {
          try { this.activeNodes.whitenoise?.source.stop(); } catch {}
          this.activeNodes.whitenoise = null;
        }, 400);
      }
      this.isPlaying.whitenoise = false;
      if (callback) callback(false);
      return false;
    }

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.04;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.0, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, this.ctx.currentTime + 0.4);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.analyser || this.ctx.destination);

    source.start();
    this.activeNodes.whitenoise = { source, gain };
    this.isPlaying.whitenoise = true;
    if (callback) callback(true);
    return true;
  }
}

window.doodleAudio = new AmbientSoundEngine();

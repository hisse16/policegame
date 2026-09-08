/**
 * Procedural Audio System using Web Audio API
 * Generates tactile UI clicks, tones, and low ambient workstation background hum.
 * Zero external audio file dependencies.
 */

class AudioSystem {
  private ctx: AudioContext | null = null;
  private ambientGainNode: GainNode | null = null;
  private uiGainNode: GainNode | null = null;
  private masterGainNode: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private isAmbientRunning = false;

  private masterVol = 0.8;
  private ambientVol = 0.4;
  private uiVol = 0.6;
  private ambientMuted = false;
  private uiMuted = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.setupGains();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private setupGains() {
    if (!this.ctx) return;
    this.masterGainNode = this.ctx.createGain();
    this.masterGainNode.gain.setValueAtTime(this.masterVol, this.ctx.currentTime);
    this.masterGainNode.connect(this.ctx.destination);

    this.ambientGainNode = this.ctx.createGain();
    this.ambientGainNode.gain.setValueAtTime(
      this.ambientMuted ? 0 : this.ambientVol * 0.15,
      this.ctx.currentTime
    );
    this.ambientGainNode.connect(this.masterGainNode);

    this.uiGainNode = this.ctx.createGain();
    this.uiGainNode.gain.setValueAtTime(
      this.uiMuted ? 0 : this.uiVol * 0.25,
      this.ctx.currentTime
    );
    this.uiGainNode.connect(this.masterGainNode);
  }

  public updateVolumes(master: number, ambient: number, ui: number, ambientMuted: boolean, uiMuted: boolean) {
    this.masterVol = master / 100;
    this.ambientVol = ambient / 100;
    this.uiVol = ui / 100;
    this.ambientMuted = ambientMuted;
    this.uiMuted = uiMuted;

    if (this.ctx && this.masterGainNode && this.ambientGainNode && this.uiGainNode) {
      this.masterGainNode.gain.setValueAtTime(this.masterVol, this.ctx.currentTime);
      this.ambientGainNode.gain.setValueAtTime(
        this.ambientMuted ? 0 : this.ambientVol * 0.15,
        this.ctx.currentTime
      );
      this.uiGainNode.gain.setValueAtTime(
        this.uiMuted ? 0 : this.uiVol * 0.25,
        this.ctx.currentTime
      );
    }
  }

  public startAmbientHum() {
    const ctx = this.ensureContext();
    if (!ctx || this.isAmbientRunning || !this.ambientGainNode) return;

    try {
      // Create a warm, low 52Hz archive hum with subtle modulation
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(52, ctx.currentTime);

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
      lfo.connect(osc.frequency);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, ctx.currentTime);

      osc.connect(filter);
      filter.connect(this.ambientGainNode);

      osc.start();
      lfo.start();

      this.ambientOsc = osc;
      this.isAmbientRunning = true;
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopAmbientHum() {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
      } catch {}
      this.ambientOsc = null;
    }
    this.isAmbientRunning = false;
  }

  public playMenuHover() {
    if (this.uiMuted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.uiGainNode) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.uiGainNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  }

  public playMenuClick() {
    if (this.uiMuted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.uiGainNode) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.uiGainNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  public playMenuSelect() {
    if (this.uiMuted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.uiGainNode) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.uiGainNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  public playMenuBack() {
    if (this.uiMuted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.uiGainNode) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.uiGainNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }

  public playMenuError() {
    if (this.uiMuted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.uiGainNode) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.uiGainNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  public playBootHum() {
    const ctx = this.ensureContext();
    if (!ctx || !this.uiGainNode) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(70, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(this.uiGainNode);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch {}
  }

  public playShutdownRelay() {
    const ctx = this.ensureContext();
    if (!ctx || !this.uiGainNode) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.uiGainNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  }
}

export const audioSystem = new AudioSystem();

type SoundName = 'click' | 'notify' | 'warning' | 'reveal' | 'success' | 'error';

let context: AudioContext | null = null;

const getContext = () => {
  if (typeof window === 'undefined') return null;
  if (!context) {
    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return null;
    context = new AudioContextCtor();
  }
  if (context.state === 'suspended') void context.resume();
  return context;
};

const tones: Record<SoundName, { frequencies: number[]; duration: number; type: OscillatorType; volume: number }> = {
  click: { frequencies: [520], duration: 0.045, type: 'sine', volume: 0.025 },
  notify: { frequencies: [620, 780], duration: 0.12, type: 'sine', volume: 0.028 },
  warning: { frequencies: [330, 280], duration: 0.16, type: 'triangle', volume: 0.032 },
  reveal: { frequencies: [392, 494, 659], duration: 0.42, type: 'sine', volume: 0.035 },
  success: { frequencies: [440, 554, 659, 880], duration: 0.55, type: 'sine', volume: 0.04 },
  error: { frequencies: [220, 175], duration: 0.2, type: 'triangle', volume: 0.03 },
};

export const playSound = (name: SoundName) => {
  const audio = getContext();
  if (!audio) return;
  const sound = tones[name];
  const start = audio.currentTime;
  const step = sound.duration / sound.frequencies.length;

  sound.frequencies.forEach((frequency, index) => {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const at = start + index * step;
    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(frequency, at);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(sound.volume, at + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + step * 0.92);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(at);
    oscillator.stop(at + step);
  });
};

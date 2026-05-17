const SOUND_PRESETS = {
  default: { frequency: 880, duration: 0.22, volume: 0.08 },
  chat: { frequency: 988, duration: 0.18, volume: 0.08 },
  announcement: { frequency: 784, duration: 0.24, volume: 0.08 },
  assignment: { frequency: 932, duration: 0.2, volume: 0.08 },
  error: { frequency: 523, duration: 0.28, volume: 0.1 },
};

export const playNotificationSound = (kind = "default") => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    const preset = SOUND_PRESETS[String(kind || "default").toLowerCase()] || SOUND_PRESETS.default;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(preset.frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(preset.volume, audioContext.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + preset.duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + preset.duration + 0.02);
    oscillator.onended = () => {
      audioContext.close();
    };
  } catch (error) {
    // Ignore audio playback errors. Browsers can block autoplay until a user gesture.
  }
};

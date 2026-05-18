const SOUND_PRESETS = {
  default: { frequency: 880, duration: 0.22, volume: 0.08 },
  chat: { frequency: 988, duration: 0.18, volume: 0.08 },
  announcement: { frequency: 784, duration: 0.24, volume: 0.08 },
  assignment: { frequency: 932, duration: 0.2, volume: 0.08 },
  error: { frequency: 523, duration: 0.28, volume: 0.1 },
};

const customNotificationSoundUrl = String(process.env.VUE_APP_NOTIFICATION_SOUND_URL || "/notif.mp3").trim();

const isAudioUrl = (value) => {
  const text = String(value || "").trim();
  if (!text) {
    return false;
  }

  return (
    /^https?:\/\//i.test(text) ||
    text.startsWith("/") ||
    text.startsWith("data:audio/") ||
    /\.(mp3|wav|ogg)(\?.*)?$/i.test(text)
  );
};

const getAudioSource = (kindOrSource) => {
  if (kindOrSource && typeof kindOrSource === "object") {
    const source = String(kindOrSource.src || kindOrSource.soundUrl || kindOrSource.url || "").trim();
    if (isAudioUrl(source)) {
      return {
        src: source,
        volume: Number(kindOrSource.volume ?? 1),
      };
    }
    return null;
  }

  const source = String(kindOrSource || "").trim();
  if (isAudioUrl(source)) {
    return {
      src: source,
      volume: 1,
    };
  }

  if (isAudioUrl(customNotificationSoundUrl)) {
    return {
      src: customNotificationSoundUrl,
      volume: 1,
    };
  }

  return null;
};

const playAudioFile = async (src, volume = 1) => {
  const audio = new Audio(src);
  audio.preload = "auto";
  audio.volume = Math.min(1, Math.max(0, Number.isFinite(volume) ? volume : 1));
  await audio.play();
};

export const playNotificationSound = async (kindOrSource = "default") => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const audioSource = getAudioSource(kindOrSource);
    if (audioSource) {
      await playAudioFile(audioSource.src, audioSource.volume);
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    const preset = SOUND_PRESETS[String(kindOrSource || "default").toLowerCase()] || SOUND_PRESETS.default;
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

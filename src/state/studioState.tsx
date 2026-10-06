import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { VOICES, MODELS, DEMO_SCRIPTS, synthesizeSpeech, VoicePersona, ModelEngine } from '../services/elevenlabs';
import { connectAudioElement, setSoundMuted, isSoundMuted, getAudioContext } from '../audio/audioContext';
import { playButtonThump, playKnobTick } from '../audio/uiSounds';
import { voicePlayer } from '../audio/voicePlayer';
import { translateText } from '../services/translation';
import { scrollToProgress } from '../scroll/lenis';

export type StudioStatus = 'SYSTEM READY' | 'SYNTHESIZING NEURAL AUDIO' | 'PLAYING ACOUSTIC STREAM' | 'ADD YOUR ELEVENLABS KEY' | 'TAKE A BREATH' | 'CONNECTION LOST';

interface StudioContextType {
  // TTS State
  text: string;
  setText: (val: string) => void;
  voiceId: string;
  setVoiceId: (val: string) => void;
  modelId: string;
  setModelId: (val: string) => void;
  stability: number;
  setStability: (val: number) => void;
  similarity: number;
  setSimilarity: (val: number) => void;
  style: number;
  setStyle: (val: number) => void;
  status: StudioStatus;
  isGenerating: boolean;
  loadDemoScript: (key: string) => void;

  // Audio Playback
  audioUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: (v: number) => void;
  playAudio: () => void;
  pauseAudio: () => void;
  togglePlayPause: () => void;
  stopAudio: () => void;
  seekAudio: (percent: number) => void;
  downloadAudio: () => void;
  handleGenerate: () => Promise<void>;

  // Big Hero Button Interaction (Speaks before scrolling)
  speakHeroGreeting: () => Promise<void>;

  // Translation
  transSource: string;
  setTransSource: (val: string) => void;
  transTarget: string;
  transSourceLang: string;
  setTransSourceLang: (val: string) => void;
  transTargetLang: string;
  setTransTargetLang: (val: string) => void;
  isTranslating: boolean;
  handleTranslate: () => Promise<void>;
  sendToStudio: () => void;

  // Sound Engine
  soundMuted: boolean;
  toggleSoundMuted: () => void;

  // Toasts & Modals
  toast: string | null;
  showToast: (msg: string) => void;
  showKeyModal: boolean;
  setShowKeyModal: (show: boolean) => void;

  // Persona cycling for [ and ] shortcuts
  cyclePersona: (dir: 1 | -1) => void;
}

const StudioContext = createContext<StudioContextType | null>(null);

export const StudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [text, setText] = useState<string>(
    "In a world fractured by silence, one voice will cut through the digital storm. When the artificial minds awaken, humanity's greatest triumph may become its final countdown."
  );
  const [voiceId, setVoiceId] = useState<string>(VOICES[0].id); // Adam (Dominant, Deep, Cinematic) by default
  const [modelId, setModelId] = useState<string>(MODELS[0].id); // Eleven Multilingual v2
  const [stability, setStabilityState] = useState<number>(0.50);
  const [similarity, setSimilarityState] = useState<number>(0.75);
  const [style, setStyleState] = useState<number>(0.00);
  const [status, setStatus] = useState<StudioStatus>('SYSTEM READY');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Audio Playback
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Translation
  const [transSource, setTransSource] = useState<string>(
    "Experience the power of neural speech synthesis across every continent and language."
  );
  const [transTarget, setTransTarget] = useState<string>('');
  const [transSourceLang, setTransSourceLang] = useState<string>('en');
  const [transTargetLang, setTransTargetLang] = useState<string>('es');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Sound Engine (ALWAYS ON by default for real narration)
  const [soundMuted, setSoundMutedState] = useState<boolean>(false);

  // UI state
  const [toast, setToast] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  // Initialize VoicePlayer Engine & State Sync
  useEffect(() => {
    voicePlayer.setVolume(volume);
    const unsub = voicePlayer.subscribe((st) => {
      setIsPlaying(st.isPlaying);
      setCurrentTime(st.currentTime);
      setDuration(st.duration);
      if (st.isPlaying) {
        setStatus('PLAYING ACOUSTIC STREAM');
      } else if (!isGenerating) {
        setStatus('SYSTEM READY');
      }
    });
    return unsub;
  }, [isGenerating]);

  // Global user gesture unlock for Web Audio context
  useEffect(() => {
    const unlock = () => {
      voicePlayer.unlockContext();
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  // Parse shareable URL hash on load
  useEffect(() => {
    try {
      if (window.location.hash.length > 1) {
        const params = new URLSearchParams(window.location.hash.slice(1));
        const hashText = params.get('t');
        const hashVoice = params.get('v');
        const hashStab = params.get('s');
        const hashSim = params.get('m');
        if (hashText) setText(decodeURIComponent(hashText));
        if (hashVoice && VOICES.some(v => v.id === hashVoice)) setVoiceId(hashVoice);
        if (hashStab) setStabilityState(parseFloat(hashStab));
        if (hashSim) setSimilarityState(parseFloat(hashSim));
      }
    } catch (e) {}
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const toggleSoundMuted = () => {
    const next = !soundMuted;
    setSoundMutedState(next);
    setSoundMuted(next);
    voicePlayer.setVolume(next ? 0 : volume);
    if (!next) {
      playButtonThump();
    }
  };

  const setStability = (val: number) => {
    setStabilityState(val);
    playKnobTick();
  };

  const setSimilarity = (val: number) => {
    setSimilarityState(val);
    playKnobTick();
  };

  const setStyle = (val: number) => {
    setStyleState(val);
    playKnobTick();
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    voicePlayer.setVolume(val);
  };

  const playAudio = () => {
    voicePlayer.resume();
  };

  const pauseAudio = () => {
    voicePlayer.pause();
  };

  const togglePlayPause = () => {
    voicePlayer.togglePlayPause();
  };

  const stopAudio = () => {
    voicePlayer.stop();
    setStatus('SYSTEM READY');
  };

  const seekAudio = (percent: number) => {
    voicePlayer.seek(percent);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const personaName = VOICES.find(v => v.id === voiceId)?.name || 'aura';
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `aura_${personaName.toLowerCase()}_${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Downloaded MP3 audio file.');
  };

  const loadDemoScript = (key: string) => {
    if (DEMO_SCRIPTS[key]) {
      setText(DEMO_SCRIPTS[key].text);
      setVoiceId(DEMO_SCRIPTS[key].recommendedVoice);
      playButtonThump();
      showToast(`Loaded ${key.toUpperCase()} demo script.`);
    }
  };

  const cyclePersona = (dir: 1 | -1) => {
    const idx = VOICES.findIndex(v => v.id === voiceId);
    if (idx === -1) return;
    const nextIdx = (idx + dir + VOICES.length) % VOICES.length;
    setVoiceId(VOICES[nextIdx].id);
    playKnobTick();
    showToast(`Switched voice to ${VOICES[nextIdx].name}`);
  };

  // Big Hero Button Interaction: "Hello. I am Aura. Give me words."
  const speakHeroGreeting = async () => {
    voicePlayer.unlockContext();
    playButtonThump();
    if (isPlaying) {
      voicePlayer.stop();
      return;
    }

    const greeting = "Hello. I am Aura. Give me words.";
    setStatus('SYNTHESIZING NEURAL AUDIO');
    setIsGenerating(true);

    try {
      const blob = await synthesizeSpeech({
        text: greeting,
        voiceId: VOICES[0].id, // Adam (verified premade 200 OK)
        modelId: 'eleven_multilingual_v2',
        stability: 0.5,
        similarity: 0.75,
        style: 0.0,
      });

      if (audioUrl) URL.revokeObjectURL(audioUrl);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      setStatus('PLAYING ACOUSTIC STREAM');
      await voicePlayer.loadAndPlayBlob(blob);
      showToast('AURA Neural Voice speaking aloud!');
    } catch (e: any) {
      console.error('[AURA Hero] ElevenLabs error:', e);
      setStatus('CONNECTION LOST');
      showToast(e.message || 'ElevenLabs narration failed');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate & Play Main Narration
  const handleGenerate = async () => {
    if (isGenerating || !text.trim()) return;
    voicePlayer.unlockContext();
    playButtonThump();
    voicePlayer.stop();
    setIsGenerating(true);
    setStatus('SYNTHESIZING NEURAL AUDIO');

    try {
      const blob = await synthesizeSpeech({
        text: text.trim(),
        voiceId: voiceId || VOICES[0].id,
        modelId: modelId || 'eleven_multilingual_v2',
        stability,
        similarity,
        style,
      });

      if (audioUrl) URL.revokeObjectURL(audioUrl);
      const newUrl = URL.createObjectURL(blob);
      setAudioUrl(newUrl);

      setStatus('PLAYING ACOUSTIC STREAM');
      await voicePlayer.loadAndPlayBlob(blob);

      // Update shareable URL hash
      const params = new URLSearchParams({
        t: encodeURIComponent(text.trim()),
        v: voiceId,
        s: stability.toFixed(2),
        m: similarity.toFixed(2),
      });
      window.history.replaceState(null, '', `#${params.toString()}`);
      showToast('ElevenLabs neural narration playing!');
    } catch (err: any) {
      console.error('[AURA Generate] Error:', err);
      if (err.message && err.message.includes('429')) {
        setStatus('TAKE A BREATH');
        showToast('Rate limit reached. Take a breath.');
      } else {
        setStatus('CONNECTION LOST');
        showToast(err.message || 'ElevenLabs synthesis failed.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Translation Workflow
  const handleTranslate = async () => {
    if (isTranslating || !transSource.trim()) return;
    setIsTranslating(true);
    playButtonThump();
    try {
      const result = await translateText(transSource, transSourceLang, transTargetLang);
      setTransTarget(result);
    } catch (e) {
      showToast('Translation service unavailable.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Send to Studio Workflow
  const sendToStudio = () => {
    const copy = transTarget || transSource;
    if (!copy.trim()) return;
    playButtonThump();
    setText(copy);
    setModelId('eleven_multilingual_v2'); // Auto-select multilingual engine
    showToast('Sent translated text to Studio!');
    scrollToProgress(0.24); // Scroll smoothly to Studio section
  };

  const value: StudioContextType = {
    text,
    setText,
    voiceId,
    setVoiceId,
    modelId,
    setModelId,
    stability,
    setStability,
    similarity,
    setSimilarity,
    style,
    setStyle,
    status,
    isGenerating,
    loadDemoScript,
    audioUrl,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    playAudio,
    pauseAudio,
    togglePlayPause,
    stopAudio,
    seekAudio,
    downloadAudio,
    handleGenerate,
    speakHeroGreeting,
    transSource,
    setTransSource,
    transTarget,
    transSourceLang,
    setTransSourceLang,
    transTargetLang,
    setTransTargetLang,
    isTranslating,
    handleTranslate,
    sendToStudio,
    soundMuted,
    toggleSoundMuted,
    toast,
    showToast,
    showKeyModal,
    setShowKeyModal,
    cyclePersona,
  };

  activeStudioInstance = value;

  return (
    <StudioContext.Provider value={value}>
      <audio
        ref={(el) => {
          audioRef.current = el;
          voicePlayer.setDomAudioElement(el);
        }}
        id="aura-dom-audio-player"
        preload="auto"
        style={{ display: 'none' }}
      />
      {children}
    </StudioContext.Provider>
  );
};

let activeStudioInstance: StudioContextType | null = null;

const defaultStudioFallback: StudioContextType = {
  text: '',
  setText: () => {},
  voiceId: 'pNInz6obpgDQGcFmaJgB',
  setVoiceId: () => {},
  modelId: 'eleven_multilingual_v2',
  setModelId: () => {},
  stability: 0.5,
  setStability: () => {},
  similarity: 0.75,
  setSimilarity: () => {},
  style: 0,
  setStyle: () => {},
  status: 'SYSTEM READY',
  isGenerating: false,
  loadDemoScript: () => {},
  audioUrl: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1.0,
  setVolume: () => {},
  playAudio: () => {},
  pauseAudio: () => {},
  togglePlayPause: () => {},
  stopAudio: () => {},
  seekAudio: () => {},
  downloadAudio: () => {},
  handleGenerate: async () => {},
  speakHeroGreeting: async () => {},
  transSource: '',
  setTransSource: () => {},
  transTarget: '',
  transSourceLang: 'en',
  setTransSourceLang: () => {},
  transTargetLang: 'es',
  setTransTargetLang: () => {},
  isTranslating: false,
  handleTranslate: async () => {},
  sendToStudio: () => {},
  soundMuted: false,
  toggleSoundMuted: () => {},
  toast: null,
  showToast: () => {},
  showKeyModal: false,
  setShowKeyModal: () => {},
  cyclePersona: () => {},
};

export function useStudio(): StudioContextType {
  const ctx = useContext(StudioContext);
  return ctx || activeStudioInstance || defaultStudioFallback;
}

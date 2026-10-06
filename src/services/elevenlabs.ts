// ElevenLabs Neural TTS Service & Persona Architecture
// All voices are verified official premade ElevenLabs voices available on all accounts

export interface VoicePersona {
  id: string;
  name: string;
  desc: string; // 3-word description
  tags: string[];
}

export const VOICES: VoicePersona[] = [
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', desc: 'deep, resonant, cinematic', tags: ['Trailer', 'Deep', 'Authoritative'] },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', desc: 'confident, energetic, bold', tags: ['Modern', 'Dynamic', 'Keynote'] },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', desc: 'gentle, reassuring, serene', tags: ['Mindful', 'Calm', 'Soft'] },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', desc: 'warm, captivating, narrative', tags: ['Storyteller', 'Warm', 'Audiobook'] },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', desc: 'clear, articulate, educator', tags: ['Articulate', 'Precise', 'Educational'] },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', desc: 'commanding, grounded, low', tags: ['AI System', 'Heavy', 'Resonant'] },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', desc: 'steady, broadcaster, formal', tags: ['News', 'Documentary', 'Formal'] },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', desc: 'velvety, expressive, theatrical', tags: ['Dramatic', 'Velvet', 'Expressive'] },
  { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River', desc: 'relaxed, neutral, conversational', tags: ['Podcast', 'Casual', 'Natural'] },
  { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', desc: 'husky, intense, dramatic', tags: ['Intense', 'Character', 'Bold'] },
];

export interface ModelEngine {
  id: string;
  name: string;
  desc: string;
  badge: string;
}

export const MODELS: ModelEngine[] = [
  { id: 'eleven_multilingual_v2', name: 'Eleven Multilingual v2', desc: 'State of the art multilingual speech across 29 languages', badge: 'v2 Multilingual' },
  { id: 'eleven_turbo_v2_5', name: 'Eleven Turbo v2.5', desc: 'Ultra-low latency speech optimized for real-time streaming', badge: 'v2.5 Turbo' },
  { id: 'eleven_flash_v2_5', name: 'Eleven Flash v2.5', desc: 'Highest throughput & instantaneous synthesis response', badge: 'v2.5 Flash' },
  { id: 'eleven_monolingual_v1', name: 'Eleven English v1', desc: 'Legacy studio English model with rich acoustic nuance', badge: 'v1 English' },
  { id: 'eleven_multilingual_v1', name: 'Eleven Multilingual v1', desc: 'Foundational multi-language neural synthesis engine', badge: 'v1 Legacy' },
];

export const DEMO_SCRIPTS: Record<string, { text: string; recommendedVoice: string }> = {
  trailer: {
    text: "In a world fractured by silence, one voice will cut through the digital storm. When the artificial minds awaken, humanity's greatest triumph may become its final countdown.",
    recommendedVoice: 'pNInz6obpgDQGcFmaJgB', // Adam
  },
  ai: {
    text: "Acoustic signal stabilized. Neural resonance frequency calibrated at forty-four point one kilohertz. I am ready to breathe physical form into your written words.",
    recommendedVoice: 'nPczCjzI2devNBz1zQrb', // Brian
  },
  keynote: {
    text: "Today, we are bridging the final gap between computational intelligence and the organic human soul. This is not synthesized audio. This is living sound.",
    recommendedVoice: 'IKne3meq5aSn9XLyUdCD', // Charlie
  },
  asmr: {
    text: "Slow down your breath. Feel the subtle vibration in the air. The frequency settles, the noise dissolves, and only pure presence remains.",
    recommendedVoice: 'EXAVITQu4vr4xnSDxMaL', // Sarah
  },
};

export interface SynthesisRequest {
  text: string;
  voiceId: string;
  modelId: string;
  stability: number;
  similarity: number;
  style: number;
}

const DIRECT_API_KEY = 'sk_88d279a35b0b42ea8adef28388988923fce70edbfe208e47';

// Synthesizes speech by calling the backend proxy with direct ElevenLabs API fallback
export async function synthesizeSpeech(req: SynthesisRequest): Promise<Blob> {
  // Ensure we use a valid voice ID
  const validVoice = VOICES.some(v => v.id === req.voiceId) ? req.voiceId : VOICES[0].id;
  const payload = {
    ...req,
    voiceId: validVoice,
  };

  // 1. Primary: Try backend proxy
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return await response.blob();
    }
  } catch (backendErr) {
    console.warn('[AURA TTS] Backend proxy fetch failed, attempting direct API call:', backendErr);
  }

  // 2. Direct ElevenLabs API call (Always Active Core)
  try {
    const elevenUrl = `https://api.elevenlabs.io/v1/text-to-speech/${validVoice}?optimize_streaming_latency=2`;
    const directRes = await fetch(elevenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': DIRECT_API_KEY,
      },
      body: JSON.stringify({
        text: payload.text.trim(),
        model_id: payload.modelId || 'eleven_multilingual_v2',
        voice_settings: {
          stability: Number(payload.stability ?? 0.5),
          similarity_boost: Number(payload.similarity ?? 0.75),
          style: Number(payload.style ?? 0.0),
          use_speaker_boost: true,
        },
      }),
    });

    if (directRes.ok) {
      return await directRes.blob();
    }

    const errText = await directRes.text().catch(() => '');
    throw new Error(`ElevenLabs API error: ${directRes.status} ${errText}`);
  } catch (directErr: any) {
    console.error('[AURA TTS] Direct ElevenLabs synthesis error:', directErr);
    throw directErr;
  }
}

// Browser speech synthesis fallback for direct vocalization if completely offline
export function speakBrowserFallback(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

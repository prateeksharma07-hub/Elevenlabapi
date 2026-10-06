// Web Audio API Singleton & Analyser
let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let sourceNode: MediaElementAudioSourceNode | null = null;
let isMuted = false; // SOUND: ON by default for instant narration playback!

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass({ sampleRate: 44100 });
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function getAudioAnalyser(): AnalyserNode {
  const ctx = getAudioContext();
  if (!analyser) {
    analyser = ctx.createAnalyser();
    analyser.fftSize = 512; // Approx 86Hz per bin
    analyser.smoothingTimeConstant = 0.8;
  }
  return analyser;
}

export function connectAudioElement(audioEl: HTMLAudioElement): void {
  try {
    const ctx = getAudioContext();
    const node = getAudioAnalyser();
    if (!sourceNode) {
      sourceNode = ctx.createMediaElementSource(audioEl);
      sourceNode.connect(node);
      node.connect(ctx.destination);
    }
  } catch (e) {
    console.warn('[AURA Audio] Connect element warning:', e);
  }
}

export function setSoundMuted(muted: boolean): void {
  isMuted = muted;
}

export function isSoundMuted(): boolean {
  return isMuted;
}

export interface AudioLevels {
  subBass: number;   // bins 0-2
  mid: number;       // bins 3-23
  treble: number;    // bins 24-93
  peak: number;      // RMS
  raw: Uint8Array;
}

const emptyArray = new Uint8Array(256);
let prevSub = 0;
let prevMid = 0;
let prevTreble = 0;
let prevPeak = 0;

export function sampleAudioLevels(isPlaying: boolean): AudioLevels {
  if (!isPlaying || !analyser) {
    // Decay smoothly to zero
    prevSub *= 0.85;
    prevMid *= 0.85;
    prevTreble *= 0.85;
    prevPeak *= 0.85;
    return {
      subBass: prevSub,
      mid: prevMid,
      treble: prevTreble,
      peak: prevPeak,
      raw: emptyArray,
    };
  }

  const freqData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freqData);

  // 1. SUB-BASS: bins 0-2 (0 to ~250 Hz)
  let subSum = 0;
  for (let i = 0; i <= 2; i++) subSum += freqData[i] || 0;
  const currentSub = subSum / (3 * 255);

  // 2. MID: bins 3-23 (~250 Hz to ~2 kHz)
  let midSum = 0;
  for (let i = 3; i <= 23; i++) midSum += freqData[i] || 0;
  const currentMid = midSum / (21 * 255);

  // 3. TREBLE: bins 24-93 (~2 kHz to ~8 kHz)
  let trebleSum = 0;
  for (let i = 24; i <= 93; i++) trebleSum += freqData[i] || 0;
  const currentTreble = trebleSum / (70 * 255);

  // 4. PEAK: RMS approximation
  let squareSum = 0;
  for (let i = 0; i < freqData.length; i++) {
    const norm = freqData[i] / 255;
    squareSum += norm * norm;
  }
  const currentPeak = Math.sqrt(squareSum / freqData.length);

  // Attack / Release filters (.6 / .12)
  const attack = 0.6;
  const release = 0.12;

  prevSub = currentSub > prevSub ? prevSub + (currentSub - prevSub) * attack : prevSub - (prevSub - currentSub) * release;
  prevMid = currentMid > prevMid ? prevMid + (currentMid - prevMid) * attack : prevMid - (prevMid - currentMid) * release;
  prevTreble = currentTreble > prevTreble ? prevTreble + (currentTreble - prevTreble) * attack : prevTreble - (prevTreble - currentTreble) * release;
  prevPeak = currentPeak > prevPeak ? prevPeak + (currentPeak - prevPeak) * 0.5 : prevPeak - (prevPeak - currentPeak) * 0.10;

  return {
    subBass: Math.max(0, Math.min(1, prevSub)),
    mid: Math.max(0, Math.min(1, prevMid)),
    treble: Math.max(0, Math.min(1, prevTreble)),
    peak: Math.max(0, Math.min(1, prevPeak)),
    raw: freqData,
  };
}

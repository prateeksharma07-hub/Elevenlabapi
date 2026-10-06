import { useState, useEffect } from 'react';
import { sampleAudioLevels, AudioLevels } from './audioContext';

export function useLevels(isPlaying: boolean, fpsLimit = 30): AudioLevels {
  const [levels, setLevels] = useState<AudioLevels>(() => sampleAudioLevels(false));

  useEffect(() => {
    let animId: number;
    let lastTime = 0;
    const interval = 1000 / fpsLimit;

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop);
      if (now - lastTime >= interval) {
        lastTime = now;
        setLevels(sampleAudioLevels(isPlaying));
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, fpsLimit]);

  return levels;
}

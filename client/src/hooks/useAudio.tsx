import { useState } from 'react';

interface UseAudioReturn {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  play: (audioBase64: string) => void;
  togglePlayPause: () => void;
}

export const useAudio = (): UseAudioReturn => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (audioBase64: string) => {
    const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
    audio.onended = () => setIsPlaying(false);
    setAudioElement(audio);
    audio.play();
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  return { audioElement, isPlaying, play, togglePlayPause };
};
import { useState } from 'react';
import { UseAudioReturn } from '../types/game';

// Utility Functions
const createAudioElement = (audioBase64: string): HTMLAudioElement => {
  const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
  return audio;
};

const handleAudioError = (error: MediaError): void => {
  console.error('Audio error:', {
    code: error.code,
    message: error.message
  });
};

const createErrorFromMediaError = (mediaError: MediaError): Error => {
  return new Error(`Audio error: ${mediaError.message} (code: ${mediaError.code})`);
};

// Hook
export const useAudio = (): UseAudioReturn => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const play = async (audioBase64: string): Promise<void> => {
    try {
      const audio = createAudioElement(audioBase64);
      
      audio.onended = () => {
        setIsPlaying(false);
        setError(null);
      };

      audio.onerror = () => {
        if (audio.error) {
          handleAudioError(audio.error);
          setError(createErrorFromMediaError(audio.error));
          setIsPlaying(false);
        }
      };

      setAudioElement(audio);
      await audio.play();
      setIsPlaying(true);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to play audio');
      console.error('Error playing audio:', error);
      setError(error);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = async (): Promise<void> => {
    if (!audioElement) return;

    try {
      if (isPlaying) {
        await audioElement.pause();
      } else {
        await audioElement.play();
      }
      setIsPlaying(!isPlaying);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to toggle audio');
      console.error('Error toggling audio:', error);
      setError(error);
      setIsPlaying(false);
    }
  };

  return { 
    audioElement, 
    isPlaying, 
    play, 
    togglePlayPause,
    error 
  };
};

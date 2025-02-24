import React, { createContext, useState, useContext, useEffect } from 'react';
import useSound from 'use-sound';
import backgroundMusic from '../assets/sounds/back-to-the-80s.mp3';
interface MusicContextType {
  isMuted: boolean;
  toggleMute: () => void;
}
const MusicContext = createContext<MusicContextType>({
  isMuted: false,
  toggleMute: () => {},
});
export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [play, { stop, sound }] = useSound(backgroundMusic, {
    loop: true,
    volume: isMuted ? 0 : 0.3,
  });
  useEffect(() => {
    play();
    return () => stop();
  }, [play, stop]);
  const toggleMute = () => {
    if (sound) {
      setIsMuted((prev) => !prev);
    }
  };
  return (
    <MusicContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </MusicContext.Provider>
  );
}
export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}

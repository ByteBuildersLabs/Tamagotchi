import React, { createContext, useState, useContext, useEffect } from 'react';
import useSound from 'use-sound';
import { useLocation } from 'react-router-dom';

// Importar las dos músicas diferentes
import calmMusic from '../assets/sounds/calm-music.mp3';
import gameMusic from '../assets/sounds/game-music.mp3';

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
  const location = useLocation();

  // Setup para la música tranquila
  const [playCalmMusic, { stop: stopCalmMusic }] = useSound(calmMusic, {
    loop: true,
    volume: isMuted ? 0 : 0.4,
  });

  // Setup para la música de juego
  const [playGameMusic, { stop: stopGameMusic }] = useSound(gameMusic, {
    loop: true,
    volume: isMuted ? 0 : 0.4,
  });

  useEffect(() => {
    // Detener ambas músicas antes de decidir cuál tocar
    stopCalmMusic();
    stopGameMusic();

    console.info('Location actual:', {
      pathname: location.pathname,
      hash: location.hash,
      search: location.search
    });

    // Con HashRouter, la ruta está en pathname
    if (location.pathname === '/fullscreen-game') {
      console.info('Iniciando música de juego para:', location.pathname);
      playGameMusic();
    } else {
      console.info('Iniciando música tranquila para:', location.pathname);
      playCalmMusic();
    }

    // Cleanup cuando el componente se desmonte
    return () => {
      stopCalmMusic();
      stopGameMusic();
    };
  }, [location.pathname, isMuted, playCalmMusic, playGameMusic, stopCalmMusic, stopGameMusic]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
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

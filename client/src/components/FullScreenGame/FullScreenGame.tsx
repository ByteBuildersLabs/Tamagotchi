import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DoodleGame from '../SkyJumpMiniGame/index.tsx';
import beastsDex from '../../data/beastDex.tsx';
import { Toaster } from 'react-hot-toast';

interface GameState {
  beastId: number;
  specie: number;
}

const FullscreenGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    // Recuperar los datos pasados a través del estado de navegación
    if (location.state?.beastId && location.state?.specie) {
        setGameState({
          beastId: location.state.beastId,
          specie: location.state.specie,
        });
    } else {
      // Si no hay datos, regresar a la página de juego
      navigate('/play');
    }

    // Añadir clase para el modo fullscreen
    document.body.classList.add('fullscreen-game-mode');
    
    return () => {
      // Limpiar al desmontar
      document.body.classList.remove('fullscreen-game-mode');
    };
  }, [location, navigate]);

  const handleExitGame = () => {
    navigate('/play');
  };

  const handleGameEnd = (score: number) => {
    setCurrentScore(score);
    
    // Opcionalmente puedes mostrar un mensaje o redirigir inmediatamente
      navigate('/play', { 
        state: { gameEnded: true, score: score }
      });
  };

  // Si no tenemos datos del juego, mostramos un loader o regresamos
  if (!gameState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fullscreen-game-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'black',
      zIndex: 9999
    }}>
      <DoodleGame 
        className="fullscreen-mode"
        style={{
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0
        }}
        onScoreUpdate={setCurrentScore}
        onGameEnd={handleGameEnd}
        beastImageRight={beastsDex[gameState.specie - 1]?.idlePicture} 
        beastImageLeft={beastsDex[gameState.specie - 1]?.idlePicture}
        onExitGame={handleExitGame}
      />
      <Toaster position="bottom-center" />
    </div>
  );
};

export default FullscreenGame;
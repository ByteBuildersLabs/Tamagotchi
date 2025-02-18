import { useState, useEffect } from 'react';
import DoodleGame from '../../SkyJumpMiniGame/index.tsx'; // Ajusta la ruta según tu estructura
import './main.css';
import toast, { Toaster } from 'react-hot-toast';
import beastsDex from '../../../data/beastDex.tsx';

// Importa las imágenes de los juegos
import doodleGameIcon from '../../../assets/img/games/doodle-game-icon.png'; // Asegúrate de tener esta imagen

// Define los juegos disponibles
const availableGames = [
  { 
    id: 'doodleGame',
    name: 'Doodle Jump',
    description: 'Ayuda a tu mascota a saltar lo más alto posible',
    icon: doodleGameIcon 
  },
  // Puedes añadir más juegos aquí en el futuro
];

// Funciones auxiliares para manejar las puntuaciones en localStorage
const getHighScore = (gameId: string, beastId: number): number => {
  const scoresStr = localStorage.getItem('gameHighScores');
  if (!scoresStr) return 0;
  
  try {
    const scores = JSON.parse(scoresStr);
    return scores[`${gameId}_${beastId}`] || 0;
  } catch (e) {
    console.error('Error parsing high scores from localStorage:', e);
    return 0;
  }
};

const saveHighScore = (gameId: string, beastId: number, score: number): void => {
  const currentHighScore = getHighScore(gameId, beastId);
  if (score <= currentHighScore) return;
  
  const scoresStr = localStorage.getItem('gameHighScores');
  let scores: { [key: string]: number } = {};
  
  try {
    if (scoresStr) {
      scores = JSON.parse(scoresStr);
    }
    scores[`${gameId}_${beastId}`] = score;
    localStorage.setItem('gameHighScores', JSON.stringify(scores));
  } catch (e) {
    console.error('Error saving high score to localStorage:', e);
  }
};

const Play = ({ 
  handleAction, 
  beast, 
  account, 
  client,
  showAnimation 
}: { 
  handleAction: any, 
  beast: any, 
  account: any, 
  client: any,
  showAnimation?: (gifPath: string) => void
}) => {
  // Estados para controlar la visualización
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGameSelection, setShowGameSelection] = useState(true);

  // Cargar puntuación máxima cuando cambia el juego seleccionado o el beast
  useEffect(() => {
    if (selectedGame && beast) {
      const savedHighScore = getHighScore(selectedGame, beast.beast_id);
      setHighScore(savedHighScore);
    }
  }, [selectedGame, beast]);

  // Función para iniciar un juego
  const startGame = async (gameId: string) => {
    if (!beast) return;
    
    // Prepara la animación si existe la función showAnimation
    if (showAnimation) {
      const playAnimation = beastsDex[beast.specie - 1].playPicture;
      showAnimation(playAnimation);
    }
    
    // Registra el inicio del juego con el backend si es necesario
    try {
      await toast.promise(
        handleAction(
          "Play", 
          () => client.actions.play(account), 
          beastsDex[beast.specie - 1].playPicture
        ),
        {
          loading: 'Preparando el juego...',
          success: '¡Juego iniciado!',
          error: 'No se pudo iniciar el juego.',
        }
      );
      
      // Actualiza el estado para mostrar el juego seleccionado
      setSelectedGame(gameId);
      setCurrentScore(0);
      setIsPlaying(true);
      setShowGameSelection(false);
      
      // Cargar la puntuación máxima para este juego y mascota
      const savedHighScore = getHighScore(gameId, beast.beast_id);
      setHighScore(savedHighScore);
    } catch (error) {
      console.error("Error iniciando el juego:", error);
    }
  };

  // Función para manejar el fin del juego y actualizar la puntuación
  const handleGameEnd = async (score: number) => {
    if (!beast || !selectedGame) return;
    
    setCurrentScore(score);
    setIsPlaying(false);
    
    // Guardar puntuación en localStorage si es un nuevo récord
    if (score > highScore) {
      saveHighScore(selectedGame, beast.beast_id, score);
      setHighScore(score);
      
      // Notificar al usuario
      toast.success(`¡Nueva puntuación máxima: ${score}!`, {
        icon: '🏆',
        duration: 4000
      });
    } else {
      toast.success(`¡Juego terminado! Puntuación: ${score}`, {
        duration: 3000
      });
    }
  };

  // Función para volver a la selección de juegos
  const returnToGameSelection = () => {
    setSelectedGame(null);
    setShowGameSelection(true);
  };

  // Renderiza la interfaz de selección de juegos
  if (showGameSelection) {
    return (
      <div className="game-selection-container">
        <h2 className="game-selection-title">Selecciona un Juego</h2>
        <div className="game-selection-grid">
          {availableGames.map((game) => (
            <div 
              key={game.id} 
              className="game-card"
              onClick={() => startGame(game.id)}
            >
              <img src={game.icon} alt={game.name} className="game-icon" />
              <h3 className="game-name">{game.name}</h3>
              <p className="game-description">{game.description}</p>
              <div className="game-high-score">
                Record: {getHighScore(game.id, beast?.beast_id || 0)}
              </div>
            </div>
          ))}
        </div>
        <Toaster position="bottom-center" />
      </div>
    );
  }

  // Renderiza el juego seleccionado
  if (selectedGame === 'doodleGame') {
    if (isPlaying) {
      return (
        <div className="game-container">
          <div className="game-score-display">
            <span>Record: {highScore}</span>
          </div>
          <DoodleGame onScoreUpdate={setCurrentScore} onGameEnd={handleGameEnd} />
          <button 
            className="return-button"
            onClick={returnToGameSelection}
          >
            Volver a la Selección
          </button>
          <Toaster position="bottom-center" />
        </div>
      );
    } else {
      // Muestra el resultado del juego
      return (
        <div className="game-result-container">
          <h2 className="game-result-title">¡Fin del Juego!</h2>
          <p className="game-result-score">Puntuación: {currentScore}</p>
          {currentScore >= highScore && (
            <p className="game-result-record">¡Nuevo récord! 🏆</p>
          )}
          <p className="game-result-record">Mejor puntuación: {highScore}</p>
          <div className="game-result-buttons">
            <button 
              className="play-again-button"
              onClick={() => startGame('doodleGame')}
            >
              Jugar de Nuevo
            </button>
            <button 
              className="return-button"
              onClick={returnToGameSelection}
            >
              Volver a la Selección
            </button>
          </div>
          <Toaster position="bottom-center" />
        </div>
      );
    }
  }

  // Por defecto, vuelve a la selección de juegos
  return (
    <div className="game-error-container">
      <p>Algo salió mal. Por favor, intenta de nuevo.</p>
      <button 
        className="return-button"
        onClick={returnToGameSelection}
      >
        Volver a la Selección
      </button>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Play;
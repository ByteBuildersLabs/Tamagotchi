// ShareModal.tsx
import React, { ChangeEvent, useEffect, useState } from 'react';
import './ShareModal.css';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'beast' | 'minigame';
  stats?: {
    level: number;
    strength: number;
    defense: number;
    speed: number;
  };
  minigameData?: {
    name: string;
    score: number;
  };
}

export const ShareProgress: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  type,
  stats,
  minigameData,
}) => {
  const [tweetMsg, setTweetMsg] = useState("");

  useEffect(() => {
    if (type === 'beast' && stats) {
      setTweetMsg(
        `🎮 Jugando ByteBeasts Tamagotchi y este es el progreso de mi Beast:\n\n` +
        `Level ${stats.level} 🆙\n` +
        `Fuerza: ${stats.strength} 💪\n` +
        `Defensa: ${stats.defense} 🛡️\n` +
        `Velocidad: ${stats.speed} ⚡\n\n` +
        `¡Estas estadísticas dependen totalmente de cómo lo alimento y lo cuido! 🌟\n\n` +
        `¡Crea tu propio Beast! 🚀\n` +
        `play.bytebeast.xyz`
      );
    } else if (type === 'minigame' && minigameData) {
      setTweetMsg(
        `🎮 I just played ${minigameData.name} mini-game in ByteBeasts Tamagotchi\n\n` +
        `My score: ${minigameData.score} 🏆\n\n` +
        `Can you break it? Challenge accepted! 💪\n` +
        `play.bytebeast.xyz`
      );
    }
  }, [type, stats, minigameData]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTweetMsg(event.target.value);
  };

  const tweetText = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetMsg)}`;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Compartir en X</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <textarea
            value={tweetMsg}
            onChange={handleChange}
            rows={6}
            className="tweet-textarea"
          />
        </div>
        
        <div className="modal-footer">
          <a
            href={tweetText}
            target="_blank"
            rel="noreferrer"
            className="share-button"
          >
            Share on X
          </a>
        </div>
      </div>
    </div>
  );
};
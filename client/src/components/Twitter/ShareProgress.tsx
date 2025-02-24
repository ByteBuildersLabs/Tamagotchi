// ShareModal.tsx
import React, { ChangeEvent, useEffect, useState } from 'react';
import './main.css';
import '../../index.css';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'beast' | 'minigame';
  stats?: {
    age: number;
    energy: number;
    hunger: number;
    happiness: number;
    clean: number;
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
        `🎮 Playing ByteBeasts Tamagotchi, and here is my Beast's progress:\n\n` +
        `🕰️ Age: ${stats.age}` + ` days\n` +
        `⚡ Energy: ${stats.energy} \n` +
        `🍖 Hunger: ${stats.hunger} \n` +
        `😊 Happiness: ${stats.happiness} \n` +
        `🛁 Cleanliness: ${stats.clean} \n\n` +
        `These are my current values! 🌟\n\n` +
        `Ready to raise your own Beast? 🚀\n` +
        `👉 https://www.babybeasts.games \n` +
        `@0xByteBeasts`
      );
    } else if (type === 'minigame' && minigameData) {
      setTweetMsg(
        `🎮 I just played ${minigameData.name} mini-game in ByteBeasts Tamagotchi\n\n` +
        `My score: ${minigameData.score} 🏆\n\n` +
        `Think you can beat it? Bring it on!🔥\n` +
        `👉 https://www.babybeasts.games \n` +
        `@0xByteBeasts`
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
          <h2>Share on X</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <textarea
            value={tweetMsg}
            onChange={handleChange}
            rows={6}
            className="tweet-textarea p"
          />
        </div>
        
        <div className="modal-footer">
          <a
            href={tweetText}
            target="_blank"
            rel="noreferrer"
            className="share-button"
          >
            Share
          </a>
        </div>
      </div>
    </div>
  );
};
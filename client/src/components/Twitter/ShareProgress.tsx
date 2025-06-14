// React and external libraries
import React, { ChangeEvent, useEffect, useState } from 'react';

// Styles
import './main.css';
import '../../index.css';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'beast' | 'minigame';
  stats?: {
    age?: number;
    energy?: number;
    hunger?: number;
    happiness?: number;
    clean?: number;
  };
  minigameData?: {
    name: string;
    score: number;
  };
  account: any;
  client: any;
}

export const ShareProgress: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  type,
  stats,
  minigameData,
  account,
  client,
}) => {
  const [tweetMsg, setTweetMsg] = useState("");

  useEffect(() => {
    if (type === 'beast' && stats) {
      setTweetMsg(
        `🎮 Playing ByteBeasts Tamagotchi, and here is my Beast's progress:\n\n` +
        `🕰️ Age: ${stats.age}` + ` ${stats.age == 1 ? 'day' : 'days'}\n` +
        `⚡ Energy: ${stats.energy} \n` +
        `🍖 Hunger: ${stats.hunger} \n` +
        `😊 Happiness: ${stats.happiness} \n` +
        `🛁 Cleanliness: ${stats.clean} \n\n` +
        `These are my current values! 🌟\n\n` +
        `Ready to raise your own Beast? 🚀\n` +
        `👉 https://www.bytebeasts.games \n` +
        `@0xByteBeasts`
      );
    } else if (type === 'minigame' && minigameData) {
      setTweetMsg(
        `🎮 I just played ${minigameData.name} mini-game in ByteBeasts Tamagotchi\n\n` +
        `My score: ${minigameData.score} 🏆\n\n` +
        `Think you can beat it? Bring it on!🔥\n` +
        `👉 https://www.bytebeasts.games \n` +
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
    <div className="modal-overlay"
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}>

      <div className="modal-content">
        <div className="modal-header">
          <h2>Share on X</h2>
          <button
            className="close-button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >×</button>
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
            onClick={async (e) => {
              e.stopPropagation();
              if (minigameData) {
                const tx = await client.achieve.achieveScoreShare(account, minigameData.score);
                console.info('achieveScoreShare ', tx)
              } else {
                const tx = await client.achieve.achieveBeastShare(account);
                console.info('achieveBeastShare ', tx)
              }
            }}
          >
          Share
        </a>
      </div>
    </div>
    </div >
  );
};

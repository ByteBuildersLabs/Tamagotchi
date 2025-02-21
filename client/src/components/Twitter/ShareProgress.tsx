import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import './main.css';

interface ShareProgressProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

export const ShareProgress: React.FC<ShareProgressProps> = ({
  open,
  setOpen,
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
  }, [type, stats, minigameData, open]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTweetMsg(event.target.value);
  };

  const tweetText = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetMsg)}`;

  const handleShare = () => {
    // Aquí puedes agregar analytics si lo necesitas
    console.log('Shared on X:', {
      type,
      ...(stats && { stats }),
      ...(minigameData && { minigameData }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] w-[95%] px-1 rounded-lg">
        <DialogHeader className="flex items-center text-2xl">
          <DialogTitle>Compartir en X</DialogTitle>
        </DialogHeader>
        <textarea
          className="bg-transparent text-white border border-white outline-none p-2 w-full min-h-[150px] rounded"
          value={tweetMsg}
          onChange={handleChange}
          rows={6}
        />
        <div className="mt-8 flex w-full justify-center">
          <a
            className="text-white twitter-share-button bg-black border border-white rounded px-4 py-2 hover:bg-white hover:text-black transition-colors"
            href={tweetText}
            target="_blank"
            rel="noreferrer"
            onClick={handleShare}
          >
            Share on X
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};
import React, { useState } from "react";
import useSound from "use-sound";
import backgroundMusic from "../../assets/sounds/music.mp3";
import music from "../../assets/img/music.svg";

function Music() {
  const [isMuted, setIsMuted] = useState(false);
  const [play, { stop, sound }] = useSound(backgroundMusic, {
    loop: true,
    volume: isMuted ? 0 : 0.3,
  });

  React.useEffect(() => {
    play();
    return () => stop();
  }, [play, stop]);

  const toggleMute = () => {
    if (sound) {
      setIsMuted((prev) => !prev);
    }
  };

  return (
    <button onClick={toggleMute} className="music-icon">
      <img src={music} className={isMuted ? 'muted' : ''} alt="Music control" />
    </button>
  );
}

export default Music;
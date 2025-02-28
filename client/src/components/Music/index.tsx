import music from "../../assets/img/music.svg";
import { useMusic } from "../../context/contextMusic"; 

function Music() {
  // Get the state and the function to toggle the state from the custom context
  const { isMuted, toggleMute } = useMusic();

  return (
    <button onClick={toggleMute} className="music-icon">
      <img src={music} className={isMuted ? 'muted' : ''} alt="Music control" />
      <span>Music</span>
    </button>
  );
}

export default Music;
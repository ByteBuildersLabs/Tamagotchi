import music from "../../assets/img/music.svg";
import { useMusic } from "../../context/contextMusic"; 

function Music() {
  // Get the state and the function to toggle the state from the custom context
  const { isMuted, toggleMute } = useMusic();

  return (
    <img 
      src={music} 
      className={isMuted ? 'muted' : ''} 
      alt="Music control" 
      onClick={toggleMute}
      style={{ cursor: 'pointer' }}
    />
  );
}

export default Music;
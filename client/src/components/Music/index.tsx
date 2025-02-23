import music from "../../assets/img/music.svg";
import { useMusic } from "../../context/contextMusic"; // Importamos el hook personalizado

function Music() {
  // Obtenemos el estado y la función del contexto
  const { isMuted, toggleMute } = useMusic();

  return (
    <button onClick={toggleMute} className="music-icon">
      <img src={music} className={isMuted ? 'muted' : ''} alt="Music control" />
    </button>
  );
}

export default Music;
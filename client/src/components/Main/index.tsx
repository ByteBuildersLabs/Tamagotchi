import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FullscreenGame from "../FullScreenGame/FullScreenGame";
import Leaderboard from "../Leadeboard";
import NewCover from "../NewCover";
import Tamagotchi from "../Tamagotchi";
import SpawnBeast from "../SpawnBeast";
import About from "../About";

function Main() {

  return (
    <Router>
      <Routes>
          <Route path="/" element={<NewCover />} />
          <Route path="/spawn" element={<SpawnBeast />} />
          <Route path="/play" element={<Tamagotchi />} />
          <Route path="/fullscreen-game" element={<FullscreenGame />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default Main;

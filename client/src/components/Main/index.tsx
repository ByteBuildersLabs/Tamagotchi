import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Leaderboard from "../Leadeboard";
import NewCover from "../NewCover";
import Tamagotchi from "../Tamagotchi";
import SpawnBeast from "../SpawnBeast";

function Main() {

  return (
    <Router>
      <Routes>
          <Route path="/" element={<NewCover />} />
          <Route path="/spawn" element={<SpawnBeast />} />
          <Route path="/play" element={<Tamagotchi />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  )
}

export default Main;

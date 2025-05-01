import { HashRouter as Router, Routes, Route } from "react-router-dom";
import FullscreenGame from "../FullScreenGame/FullScreenGame";
import Leaderboard from "../Leadeboard";
import NewCover from "../NewCover";
import Tamagotchi from "../Tamagotchi";
import SpawnBeast from "../SpawnBeast";
import About from "../About";
import { useEffect } from "react";
import { usePlayer } from "../../hooks/usePlayers.tsx";
import { requestNotificationPermission } from "../../utils/notification.tsx";

import { useDojoSDK } from "@dojoengine/sdk/react";
import { useAccount } from "@starknet-react/core";

function Main() {

  const { client } = useDojoSDK();
  const { account } = useAccount();

  const { player } = usePlayer();

  useEffect(() => {
    if (player?.address) {
      requestNotificationPermission(account,client);
    } else {
      console.log("Player address not available yet.");
    }
  }, [player]);

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

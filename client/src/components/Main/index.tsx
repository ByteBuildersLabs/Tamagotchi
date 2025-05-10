import { HashRouter as Router, Routes, Route } from "react-router-dom";
import FullscreenGame from "../FullScreenGame/FullScreenGame";
import Leaderboard from "../Leadeboard";
import NewCover from "../NewCover";
import Tamagotchi from "../Tamagotchi";
import SpawnBeast from "../SpawnBeast";
import { useEffect } from "react";
import { usePlayer } from "../../hooks/usePlayers.tsx";
import { requestNotificationPermission } from "../../utils/notification.tsx";

import { useDojoSDK } from "@dojoengine/sdk/react";
import { useAccount } from "@starknet-react/core";
import { MusicProvider } from "../../context/contextMusic.tsx";

function Main() {

  const { client } = useDojoSDK();
  const { account } = useAccount();

  const { player } = usePlayer();

  useEffect(() => {
    if (player?.address) {
      requestNotificationPermission(account, client);
    } else {
      console.log("Player address not available yet.");
    }
  }, [player]);

  return (
    <Router>
      <MusicProvider>
        <Routes>
          <Route path="/" element={<NewCover />} />
          <Route path="/spawn" element={<SpawnBeast />} />
          <Route path="/play" element={<Tamagotchi />} />
          <Route path="/fullscreen-game" element={<FullscreenGame />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </MusicProvider>
    </Router>
  )
}

export default Main;

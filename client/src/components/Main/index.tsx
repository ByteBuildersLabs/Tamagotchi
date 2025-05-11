// React and external libraries
import { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { useAccount } from "@starknet-react/core";

// Internal components
import FullscreenGame from "../FullScreenGame/FullScreenGame";
import Leaderboard from "../Leadeboard";
import NewCover from "../NewCover";
import Tamagotchi from "../Tamagotchi";
import SpawnBeast from "../SpawnBeast";

// Hooks and Contexts
import { usePlayer } from "../../hooks/usePlayers.tsx";
import { MusicProvider } from "../../context/contextMusic.tsx";

// Services and Utils
import { requestNotificationPermission } from "../../utils/notification.tsx";

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

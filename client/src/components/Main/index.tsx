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

// Types
interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

// Constants
const ROUTES: RouteConfig[] = [
  { path: "/", element: <NewCover /> },
  { path: "/spawn", element: <SpawnBeast /> },
  { path: "/play", element: <Tamagotchi /> },
  { path: "/fullscreen-game", element: <FullscreenGame /> },
  { path: "/leaderboard", element: <Leaderboard /> }
];

// Components
const AppRoutes = () => (
  <Routes>
    {ROUTES.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ))}
  </Routes>
);

// Main Component
function Main() {
  // Hooks
  const { client } = useDojoSDK();
  const { account } = useAccount();
  const { player } = usePlayer();

  // Effects
  useEffect(() => {
    const handleNotificationPermission = async () => {
      if (player?.address) {
        await requestNotificationPermission(account, client);
      } else {
        console.log("Player address not available yet.");
      }
    };

    handleNotificationPermission();
  }, [player, account, client]);

  return (
    <Router>
      <MusicProvider>
        <AppRoutes />
      </MusicProvider>
    </Router>
  );
}

export default Main;

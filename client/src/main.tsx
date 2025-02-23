// React imports
import { StrictMode } from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalProvider } from "./hooks/appContext.tsx";
import { MusicProvider } from "./context/contextMusic.tsx";

// Dojo imports
import { init } from "@dojoengine/sdk";
import { DojoSdkProvider } from "@dojoengine/sdk/react";
import type { SchemaType } from "./dojo/bindings.ts";
import { setupWorld } from "./dojo/contracts.gen.ts";
import { dojoConfig } from "./dojo/dojoConfig.ts";
import StarknetProvider from "./dojo/starknet-provider.tsx";

// Import components and style
import Main from "./components/Main/index.tsx";
import Bag from "./components/Bag/index.tsx";
import Dex from "./components/BeastsDexGrid/index.tsx";
import Chat from "./components/Chat/index.tsx";

// Import the layout component
import AppLayout from "./components/Layouts/AppLayout.tsx";
import SpawnBeast from "./components/SpawnBeast/index.tsx";
import Lore from "./components/Lore/index.tsx";
import "./index.css";

async function main() {
  const sdk = await init<SchemaType>({
    client: {
      toriiUrl: dojoConfig.toriiUrl,
      relayUrl: dojoConfig.relayUrl,
      worldAddress: dojoConfig.manifest.world.address,
    },
    domain: {
      name: "WORLD_NAME",
      version: "1.0",
      chainId: "KATANA",
      revision: "1",
    },
  });

  const rootElement = document.getElementById("root");
  if (rootElement) {
    ReactDOM.render(
      <StrictMode>
        <DojoSdkProvider
          sdk={sdk}
          dojoConfig={dojoConfig}
          clientFn={setupWorld}
        >
          <StarknetProvider>
            <GlobalProvider>
              <MusicProvider> {/* Añadido aquí */}
                  <Router>
                    <Routes>
                      <Route element={<AppLayout />}>
                        <Route path="/" element={<Main />} />
                        <Route path="/hatch" element={<SpawnBeast />} />
                        <Route path="/bag" element={<Bag />} />
                        <Route path="/dex" element={<Dex />} />
                        <Route path="/lore" element={<Lore />} />
                        <Route path="/chat" element={<Chat />} />
                      </Route>
                    </Routes>
                  </Router>
              </MusicProvider>
            </GlobalProvider>
          </StarknetProvider>
        </DojoSdkProvider>
      </StrictMode>,
      rootElement
    );
  }
}

main().catch((error) => {
  console.error("Hello: Falló la inicialización de la aplicación:", error);
});

import { createContext, useContext, ReactNode } from "react";
import { SchemaType } from "../dojo/bindings";
import { SDK } from '@dojoengine/sdk';
import { useAccount } from '@starknet-react/core';
import { usePlayer } from "./usePlayers";
import { useBeast } from "./useBeasts";
import { useBeastStatus } from "./useBeastsStatus";
import { useBeastsStats } from "./useBeastsStats";

interface GlobalState {
  account: any;
  player: any;
  beast: any;
  beasts: any;
  beastStatus: any;
  beastsStatus: any;
  beastStats: any;
  beastsStats: any;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider = ({ children, sdk }: { children: ReactNode; sdk: SDK<SchemaType> }) => {
  const { account } = useAccount();

  const { player } = usePlayer(sdk);

  const { beast } = useBeast(sdk);

  const { beasts } = useBeast(sdk);

  const { beastStatus, beastsStatus } = useBeastStatus(sdk);

  const { beastStats, beastsStats } = useBeastsStats(sdk);

  return (
    <GlobalContext.Provider value={{ 
      account,
      player,
      beast,
      beasts,
      beastStatus,
      beastsStatus,
      beastStats,
      beastsStats
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

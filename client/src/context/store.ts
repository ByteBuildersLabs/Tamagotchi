import { create } from "zustand";

interface AppState {
  zplayer: any;
  setPlayer: (player: any) => void;
  zbeasts: any;
  setBeasts: (beasts: any) => void;
  zfoods: any;
  setFoods: (foods: any) => void;
  zcurrentBeast: any;
  setCurrentBeast: (beast: any) => void;
  zstatus: any;
  setStatus: (status: any) => void;
}

const useAppStore = create<AppState>((set) => ({
  zplayer: {},
  setPlayer: (zplayer) => set({ zplayer }),
  zbeasts: [],
  setBeasts: (zbeasts) => set({ zbeasts }),
  zfoods: [],
  setFoods: (zfoods) => set({ zfoods }),
  zcurrentBeast: {},
  setCurrentBeast: (zcurrentBeast) => set({ zcurrentBeast }),
  zstatus: [],
  setStatus: (zstatus) => set({ zstatus }),
}));

export default useAppStore;

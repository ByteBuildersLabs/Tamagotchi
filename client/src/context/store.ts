import { create } from "zustand";

interface AppState {
  zfoods: any;
  setFoods: (foods: any) => void;
}

const useAppStore = create<AppState>((set) => ({
  zfoods: [],
  setFoods: (zfoods) => set({ zfoods }),
}));

export default useAppStore;
